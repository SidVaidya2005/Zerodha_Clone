const express = require("express");
const cors = require("cors");
const YahooFinance = require("yahoo-finance2").default;

const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

// Instantiate yahoo-finance2 (v3+ requires explicit instantiation)
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const pickFirstFiniteNumber = (...values) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
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
        try {
          // Try NSE first, then BSE as fallback for symbols that may not resolve on NSE.
          let quote;
          try {
            quote = await yahooFinance.quote(`${symbol}.NS`);
          } catch {
            quote = await yahooFinance.quote(`${symbol}.BO`);
          }

          const close = pickFirstFiniteNumber(
            quote.regularMarketPrice,
            quote.regularMarketPreviousClose,
            quote.regularMarketOpen,
            quote.postMarketPrice,
            quote.bid,
            quote.ask,
          );

          const previousClose = pickFirstFiniteNumber(
            quote.regularMarketPreviousClose,
            quote.regularMarketOpen,
            close,
          );

          if (close === null || previousClose === null) {
            return {
              symbol,
              error: true,
              message: "No valid quote fields were returned by Yahoo Finance",
            };
          }

          return {
            symbol,
            data: {
              close,
              previousClose,
            },
          };
        } catch (err) {
          console.error("Error fetching symbol:", symbol, err.message);
          return { symbol, error: true, message: err.message };
        }
      }),
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch equity quotes" });
  }
});

app.get("/api/indices", async (req, res) => {
  try {
    const [niftyQuote, sensexQuote] = await Promise.all([
      yahooFinance.quote("^NSEI"),
      yahooFinance.quote("^BSESN"),
    ]);

    const mapIndexQuote = (quote, fallbackName) => {
      const price = pickFirstFiniteNumber(
        quote.regularMarketPrice,
        quote.regularMarketPreviousClose,
        quote.regularMarketOpen,
        quote.postMarketPrice,
      );

      const previousClose = pickFirstFiniteNumber(
        quote.regularMarketPreviousClose,
        quote.regularMarketOpen,
        price,
      );

      const percentChange =
        price !== null && previousClose && previousClose > 0
          ? Number((((price - previousClose) / previousClose) * 100).toFixed(2))
          : 0;

      return {
        name: quote.shortName || fallbackName,
        symbol: quote.symbol || fallbackName,
        price,
        previousClose,
        percentChange,
        marketState: quote.marketState || "UNKNOWN",
      };
    };

    res.json({
      nifty: mapIndexQuote(niftyQuote, "NIFTY 50"),
      sensex: mapIndexQuote(sensexQuote, "SENSEX"),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching indices from Yahoo:", error.message);
    res.status(500).json({ error: "Failed to fetch indices quotes" });
  }
});

app.get("/api/market-status", async (req, res) => {
  try {
    // Determine NSE market status based on IST time (09:15 - 15:30 on weekdays)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const day = ist.getUTCDay(); // 0=Sun, 6=Sat
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
  console.log(`Indian Stocks Proxy Server running on port ${port}`);
});
