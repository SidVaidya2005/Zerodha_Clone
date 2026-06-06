const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

// --- Twelve Data config ------------------------------------------------------
// Yahoo Finance blocks datacenter IPs, so quotes come from Twelve Data, which
// permits server-side use with an API key. Free tier: 8 API credits/min and
// 800/day, where each symbol quote costs 1 credit. Set TWELVEDATA_API_KEY on the
// proxy service (and TWELVEDATA_CREDITS_PER_MIN / QUOTE_TTL_MS to tune).
const API_KEY = process.env.TWELVEDATA_API_KEY || "";
const TD_BASE = "https://api.twelvedata.com";
if (!API_KEY) {
  console.warn(
    "⚠️  TWELVEDATA_API_KEY is not set — /api/indian-stocks and /api/indices return errors until it is."
  );
}

// --- Credit budget (per-minute AND per-day) ----------------------------------
// Twelve Data's free tier caps usage at 8 credits/min and 800/day (1 credit per
// symbol). We track both rolling windows and only ever spend up to whichever has
// less headroom; when neither has room we serve cache/seed. `MAX_REFRESH_PER_REQUEST`
// keeps a single poll from claiming the whole minute (avoids the 8/8 burst and
// leaves room for indices).
const CREDITS_PER_MIN = Number(process.env.TWELVEDATA_CREDITS_PER_MIN) || 8;
const DAILY_LIMIT = Number(process.env.TWELVEDATA_DAILY_LIMIT) || 800;
const MAX_REFRESH_PER_REQUEST = Number(process.env.TWELVEDATA_MAX_REFRESH_PER_REQUEST) || 6;

let minuteStart = Date.now();
let minuteUsed = 0;
let dayStart = Date.now();
let dayUsed = 0;
let dailyExhaustedLogged = false;

function rollWindows() {
  const now = Date.now();
  if (now - minuteStart >= 60_000) {
    minuteStart = now;
    minuteUsed = 0;
  }
  if (now - dayStart >= 24 * 60 * 60_000) {
    dayStart = now;
    dayUsed = 0;
    dailyExhaustedLogged = false;
  }
}

function creditsRemaining() {
  rollWindows();
  return Math.max(0, Math.min(CREDITS_PER_MIN - minuteUsed, DAILY_LIMIT - dayUsed));
}

function spendCredit() {
  rollWindows();
  minuteUsed += 1;
  dayUsed += 1;
  if (dayUsed >= DAILY_LIMIT && !dailyExhaustedLogged) {
    dailyExhaustedLogged = true;
    console.warn(
      `Twelve Data daily budget (${DAILY_LIMIT}) reached — serving cached/seed prices until the 24h window rolls.`
    );
  }
}

// --- One quote fetch ---------------------------------------------------------
// Returns { ok: true, quote } | { ok: false, planRestricted } so callers can
// tell a paywalled symbol (free tier returns code 404 "…Grow or Venture plan…")
// from a transient failure and stop re-querying the former.
const fetchQuote = async (symbol, exchange) => {
  const params = { symbol, apikey: API_KEY };
  if (exchange) params.exchange = exchange;
  let data;
  try {
    // validateStatus: never throw — Twelve Data puts its error object in the body.
    ({ data } = await axios.get(`${TD_BASE}/quote`, {
      params,
      timeout: 10_000,
      validateStatus: () => true,
    }));
  } catch {
    return { ok: false, planRestricted: false };
  }

  if (data && data.status === "error") {
    const planRestricted = data.code === 404 && /\bplan\b/i.test(data.message || "");
    return { ok: false, planRestricted };
  }

  const close = Number(data && data.close);
  if (!Number.isFinite(close)) return { ok: false, planRestricted: false };
  const previousClose = Number(data.previous_close);
  const percentChange = Number(data.percent_change);
  return {
    ok: true,
    quote: {
      symbol: data.symbol || symbol,
      close,
      previousClose: Number.isFinite(previousClose) ? previousClose : close,
      percentChange: Number.isFinite(percentChange) ? percentChange : 0,
      marketState: data.is_market_open ? "REGULAR" : "CLOSED",
    },
  };
};

// --- Equity quote cache (NSE, BSE fallback) ----------------------------------
const QUOTE_TTL_MS = Number(process.env.QUOTE_TTL_MS) || 120_000;
const quoteCache = new Map(); // symbol -> { close, previousClose, fetchedAt }

// Symbols the current plan can't serve (free tier paywalls most NSE names) are
// parked here so we don't keep spending credits re-discovering that. Re-checked
// only every 12h by default, so paywalled symbols cost ~negligible daily credits.
// They fall through to the dashboard's seeded price instead.
const UNAVAILABLE_TTL_MS = Number(process.env.UNAVAILABLE_TTL_MS) || 12 * 60 * 60_000;
const unavailableUntil = new Map(); // symbol -> timestamp

const isUnavailable = (symbol) => {
  const until = unavailableUntil.get(symbol);
  if (!until) return false;
  if (Date.now() >= until) {
    unavailableUntil.delete(symbol);
    return false;
  }
  return true;
};

const markUnavailable = (symbol) => {
  unavailableUntil.set(symbol, Date.now() + UNAVAILABLE_TTL_MS);
};

const refreshEquity = async (symbol) => {
  if (!API_KEY || creditsRemaining() < 1) return;
  spendCredit();
  let res = await fetchQuote(symbol, "NSE");
  if (res.planRestricted) {
    markUnavailable(symbol);
    return;
  }
  // Fall back to BSE only if NSE had nothing and we still have budget.
  if (!res.ok && creditsRemaining() >= 1) {
    spendCredit();
    res = await fetchQuote(symbol, "BSE");
    if (res.planRestricted) {
      markUnavailable(symbol);
      return;
    }
  }
  if (res.ok) {
    quoteCache.set(symbol, {
      close: res.quote.close,
      previousClose: res.quote.previousClose,
      fetchedAt: Date.now(),
    });
  }
};

app.get("/api/indian-stocks", async (req, res) => {
  const symbols = (req.query.symbols || "")
    .split(",")
    .map((symbol) => symbol.trim())
    .filter(Boolean);

  if (symbols.length === 0) {
    return res.status(400).json({
      error: "Please provide symbols in the query string ?symbols=TCS,INFY",
    });
  }

  // Refresh the stalest missing/expired symbols, bounded by the minute budget;
  // everything else is served from cache so the watchlist always responds fast.
  const now = Date.now();
  const stale = symbols
    .filter((symbol) => {
      if (isUnavailable(symbol)) return false; // paywalled — don't spend credits
      const cached = quoteCache.get(symbol);
      return !cached || now - cached.fetchedAt > QUOTE_TTL_MS;
    })
    .sort((a, b) => (quoteCache.get(a)?.fetchedAt || 0) - (quoteCache.get(b)?.fetchedAt || 0));

  const refreshBudget = Math.min(creditsRemaining(), MAX_REFRESH_PER_REQUEST);
  await Promise.all(stale.slice(0, refreshBudget).map(refreshEquity));

  const results = symbols.map((symbol) => {
    const cached = quoteCache.get(symbol);
    if (!cached) {
      let message;
      if (!API_KEY) message = "TWELVEDATA_API_KEY not configured";
      else if (isUnavailable(symbol)) message = "Not available on the current Twelve Data plan";
      else message = "No data yet (rate-limited; will populate shortly)";
      return { symbol, error: true, message };
    }
    return {
      symbol,
      data: { close: cached.close, previousClose: cached.previousClose },
    };
  });

  res.json(results);
});

// --- Indices (best-effort) ---------------------------------------------------
// Twelve Data's free tier does NOT expose the NIFTY 50 / SENSEX spot index level
// (symbol search only returns ETFs that track them, whose prices are not the
// index value). If your plan serves real index symbols, set them via env;
// otherwise we 429 so the dashboard keeps its built-in snapshot instead of
// showing a wrong number.
const NIFTY_SYMBOL = process.env.TWELVEDATA_NIFTY_SYMBOL || "";
const SENSEX_SYMBOL = process.env.TWELVEDATA_SENSEX_SYMBOL || "";
const INDICES_TTL_MS = 60_000;
let indicesCache = { payload: null, expiresAt: 0 };

const mapIndexQuote = (quote, fallbackName) => ({
  name: fallbackName,
  symbol: quote?.symbol || fallbackName,
  price: quote ? quote.close : null,
  previousClose: quote ? quote.previousClose : null,
  percentChange: quote ? quote.percentChange : 0,
  marketState: quote ? quote.marketState : "UNKNOWN",
});

app.get("/api/indices", async (req, res) => {
  const now = Date.now();
  if (indicesCache.payload && now < indicesCache.expiresAt) {
    return res.json(indicesCache.payload);
  }

  // No usable index symbols → tell the client to hold its snapshot (429 is the
  // signal useIndicesPolling backs off on).
  if (!API_KEY || !NIFTY_SYMBOL || !SENSEX_SYMBOL) {
    return res.status(429).json({ error: "Live indices not configured" });
  }
  if (creditsRemaining() < 2) {
    if (indicesCache.payload) return res.json(indicesCache.payload);
    return res.status(429).json({ error: "Rate-limited" });
  }

  try {
    spendCredit();
    spendCredit();
    const [niftyRes, sensexRes] = await Promise.all([
      fetchQuote(NIFTY_SYMBOL),
      fetchQuote(SENSEX_SYMBOL),
    ]);
    const nifty = niftyRes.ok ? niftyRes.quote : null;
    const sensex = sensexRes.ok ? sensexRes.quote : null;

    if (!nifty && !sensex) {
      if (indicesCache.payload) return res.json(indicesCache.payload);
      return res.status(429).json({ error: "Indices unavailable" });
    }

    const payload = {
      nifty: mapIndexQuote(nifty, "NIFTY 50"),
      sensex: mapIndexQuote(sensex, "SENSEX"),
      updatedAt: new Date().toISOString(),
    };
    indicesCache = { payload, expiresAt: Date.now() + INDICES_TTL_MS };
    res.json(payload);
  } catch (error) {
    console.error("Error fetching indices from Twelve Data:", error.message);
    if (indicesCache.payload) return res.json(indicesCache.payload);
    res.status(500).json({ error: "Failed to fetch indices quotes" });
  }
});

app.get("/api/market-status", async (req, res) => {
  try {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const day = ist.getUTCDay();
    const hours = ist.getUTCHours();
    const minutes = ist.getUTCMinutes();
    const timeInMin = hours * 60 + minutes;

    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = timeInMin >= 9 * 60 + 15 && timeInMin <= 15 * 60 + 30;
    const isOpen = isWeekday && isMarketHours;

    res.json({ marketState: isOpen ? "REGULAR" : "CLOSED" });
  } catch (error) {
    console.error("Error determining market status:", error);
    res.status(500).json({ error: "Failed to fetch market status" });
  }
});

app.listen(port, () => {
  console.log(`✅ Indian Stocks Proxy Server running on port ${port}`);
  console.log(`📊 Using Twelve Data for NSE/BSE quotes`);
});
