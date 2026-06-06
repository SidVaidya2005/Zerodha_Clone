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

// --- Rolling per-minute credit budget ----------------------------------------
// The watchlist has more symbols than the free tier allows per minute, so we
// cap how many quotes we pull each minute and serve the rest from cache.
const CREDITS_PER_MIN = Number(process.env.TWELVEDATA_CREDITS_PER_MIN) || 8;
let windowStart = Date.now();
let creditsUsed = 0;

function creditsRemaining() {
  if (Date.now() - windowStart >= 60_000) {
    windowStart = Date.now();
    creditsUsed = 0;
  }
  return Math.max(0, CREDITS_PER_MIN - creditsUsed);
}

function spendCredit() {
  creditsRemaining(); // roll the window first if it has elapsed
  creditsUsed += 1;
}

// --- One quote fetch ---------------------------------------------------------
const fetchQuote = async (symbol, exchange) => {
  const params = { symbol, apikey: API_KEY };
  if (exchange) params.exchange = exchange;
  const { data } = await axios.get(`${TD_BASE}/quote`, { params, timeout: 10_000 });
  // Twelve Data signals problems with { status: "error", ... }.
  if (!data || data.status === "error") return null;
  const close = Number(data.close);
  if (!Number.isFinite(close)) return null;
  const previousClose = Number(data.previous_close);
  const percentChange = Number(data.percent_change);
  return {
    symbol: data.symbol || symbol,
    close,
    previousClose: Number.isFinite(previousClose) ? previousClose : close,
    percentChange: Number.isFinite(percentChange) ? percentChange : 0,
    marketState: data.is_market_open ? "REGULAR" : "CLOSED",
  };
};

// --- Equity quote cache (NSE, BSE fallback) ----------------------------------
const QUOTE_TTL_MS = Number(process.env.QUOTE_TTL_MS) || 120_000;
const quoteCache = new Map(); // symbol -> { close, previousClose, fetchedAt }

const refreshEquity = async (symbol) => {
  if (!API_KEY || creditsRemaining() < 1) return;
  spendCredit();
  let quote = null;
  try {
    quote = await fetchQuote(symbol, "NSE");
  } catch {
    quote = null;
  }
  // Fall back to BSE only if NSE had nothing and we still have budget.
  if (!quote && creditsRemaining() >= 1) {
    spendCredit();
    try {
      quote = await fetchQuote(symbol, "BSE");
    } catch {
      quote = null;
    }
  }
  if (quote) {
    quoteCache.set(symbol, {
      close: quote.close,
      previousClose: quote.previousClose,
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
      const cached = quoteCache.get(symbol);
      return !cached || now - cached.fetchedAt > QUOTE_TTL_MS;
    })
    .sort((a, b) => (quoteCache.get(a)?.fetchedAt || 0) - (quoteCache.get(b)?.fetchedAt || 0));

  await Promise.all(stale.slice(0, creditsRemaining()).map(refreshEquity));

  const results = symbols.map((symbol) => {
    const cached = quoteCache.get(symbol);
    if (!cached) {
      return {
        symbol,
        error: true,
        message: API_KEY
          ? "No data yet (rate-limited; will populate shortly)"
          : "TWELVEDATA_API_KEY not configured",
      };
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
    const [nifty, sensex] = await Promise.all([
      fetchQuote(NIFTY_SYMBOL).catch(() => null),
      fetchQuote(SENSEX_SYMBOL).catch(() => null),
    ]);

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
