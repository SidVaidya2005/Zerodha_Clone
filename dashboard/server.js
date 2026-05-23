const express = require("express");
const cors = require("cors");
const YahooFinance = require("yahoo-finance2").default;
require("dotenv").config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

const yahooFinance = new YahooFinance();

const INDICES_CACHE_TTL_MS = 60_000;
let indicesCache = { payload: null, expiresAt: 0 };

const safeQuote = async (symbol) => {
  try {
    const quote = await yahooFinance.quote(symbol);
    return quote || null;
  } catch (err) {
    return null;
  }
};

app.get("/api/indian-stocks", async (req, res) => {
  const symbols = req.query.symbols
    ? req.query.symbols
        .split(",")
        .map((symbol) => symbol.trim())
        .filter(Boolean)
    : [];

  if (symbols.length === 0) {
    return res.status(400).json({
      error: "Please provide symbols in the query string?symbols=TCS,INFY",
    });
  }

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = (await safeQuote(`${symbol}.NS`)) || (await safeQuote(`${symbol}.BO`));

        if (!quote || typeof quote.regularMarketPrice !== "number") {
          return {
            symbol,
            error: true,
            message: "No data available for this symbol",
          };
        }

        return {
          symbol,
          data: {
            close: quote.regularMarketPrice,
            previousClose:
              typeof quote.regularMarketPreviousClose === "number"
                ? quote.regularMarketPreviousClose
                : quote.regularMarketPrice,
          },
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Error in indian-stocks endpoint:", error.message);
    res.status(500).json({ error: "Failed to fetch equity quotes" });
  }
});

app.get("/api/indices", async (req, res) => {
  const now = Date.now();
  if (indicesCache.payload && now < indicesCache.expiresAt) {
    return res.json(indicesCache.payload);
  }

  try {
    const [nifty, sensex] = await Promise.all([safeQuote("^NSEI"), safeQuote("^BSESN")]);

    const mapIndexQuote = (quote, fallbackName) => {
      if (!quote || typeof quote.regularMarketPrice !== "number") {
        return {
          name: fallbackName,
          symbol: fallbackName,
          price: null,
          previousClose: null,
          percentChange: 0,
          marketState: "UNKNOWN",
        };
      }

      const price = quote.regularMarketPrice;
      const previousClose =
        typeof quote.regularMarketPreviousClose === "number"
          ? quote.regularMarketPreviousClose
          : null;

      const percentChange =
        typeof quote.regularMarketChangePercent === "number"
          ? Number(quote.regularMarketChangePercent.toFixed(2))
          : previousClose && previousClose > 0
            ? Number((((price - previousClose) / previousClose) * 100).toFixed(2))
            : 0;

      return {
        name: fallbackName,
        symbol: quote.symbol || fallbackName,
        price,
        previousClose,
        percentChange,
        marketState: quote.marketState || "REGULAR",
      };
    };

    const payload = {
      nifty: mapIndexQuote(nifty, "NIFTY 50"),
      sensex: mapIndexQuote(sensex, "SENSEX"),
      updatedAt: new Date().toISOString(),
    };

    indicesCache = { payload, expiresAt: Date.now() + INDICES_CACHE_TTL_MS };
    res.json(payload);
  } catch (error) {
    console.error("Error fetching indices from Yahoo Finance:", error.message);
    if (indicesCache.payload) {
      return res.json(indicesCache.payload);
    }
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
  console.log(`📊 Using yahoo-finance2 for NSE/BSE quotes`);
});
