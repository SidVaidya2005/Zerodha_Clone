const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

if (!ALPHA_VANTAGE_API_KEY) {
  console.error("⚠️  ALPHA_VANTAGE_API_KEY is not set in .env file");
  process.exit(1);
}

// Rate limiting for Alpha Vantage (5 calls/minute free tier)
let apiCallCount = 0;
let apiCallResetTime = Date.now() + 60000;

const checkRateLimit = () => {
  if (Date.now() > apiCallResetTime) {
    apiCallCount = 0;
    apiCallResetTime = Date.now() + 60000;
  }
  if (apiCallCount >= 5) {
    return false;
  }
  apiCallCount++;
  return true;
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
    const results = [];
    
    // Process symbols in batches to respect rate limit (5 calls/min)
    for (const symbol of symbols) {
      if (!checkRateLimit()) {
        results.push({
          symbol,
          error: true,
          message: "Rate limit reached. Please wait a moment.",
        });
        continue;
      }

      try {
        // Alpha Vantage uses symbol format without exchange suffix for search
        // For Indian stocks, we'll use the base symbol
        const response = await axios.get(
          `https://www.alphavantage.co/query`,
          {
            params: {
              function: "GLOBAL_QUOTE",
              symbol: `${symbol}.BSE`, // Try BSE format for Indian stocks
              apikey: ALPHA_VANTAGE_API_KEY,
            },
            timeout: 10000,
          }
        );

        const quote = response.data["Global Quote"];

        if (!quote || Object.keys(quote).length === 0) {
          // If BSE fails, it might be that the symbol doesn't exist
          results.push({
            symbol,
            error: true,
            message: "No data available for this symbol",
          });
          continue;
        }

        const close = parseFloat(quote["05. price"]);
        const previousClose = parseFloat(quote["08. previous close"]);

        if (isNaN(close) || isNaN(previousClose)) {
          results.push({
            symbol,
            error: true,
            message: "Invalid price data received",
          });
          continue;
        }

        results.push({
          symbol,
          data: {
            close,
            previousClose,
          },
        });
      } catch (err) {
        console.error("Error fetching symbol:", symbol, err.message);
        results.push({ 
          symbol, 
          error: true, 
          message: err.response?.data?.["Error Message"] || err.message 
        });
      }

      // Small delay between requests to be respectful to API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.json(results);
  } catch (error) {
    console.error("Error in indian-stocks endpoint:", error);
    res.status(500).json({ error: "Failed to fetch equity quotes" });
  }
});

app.get("/api/indices", async (req, res) => {
  try {
    // Alpha Vantage symbols for Indian indices
    // NIFTY 50: ^NSEI or NIFTY
    // SENSEX: ^BSESN or SENSEX
    
    if (!checkRateLimit()) {
      return res.status(429).json({ 
        error: "Rate limit reached. Please wait a moment." 
      });
    }

    const [niftyResponse, sensexResponse] = await Promise.all([
      axios.get("https://www.alphavantage.co/query", {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: "NIFTY",
          apikey: ALPHA_VANTAGE_API_KEY,
        },
        timeout: 10000,
      }).catch(err => ({ data: {} })),
      axios.get("https://www.alphavantage.co/query", {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: "SENSEX",
          apikey: ALPHA_VANTAGE_API_KEY,
        },
        timeout: 10000,
      }).catch(err => ({ data: {} })),
    ]);

    apiCallCount += 2; // Account for both calls

    const mapIndexQuote = (response, fallbackName) => {
      const quote = response.data["Global Quote"];
      
      if (!quote || Object.keys(quote).length === 0) {
        return {
          name: fallbackName,
          symbol: fallbackName,
          price: null,
          previousClose: null,
          percentChange: 0,
          marketState: "UNKNOWN",
        };
      }

      const price = parseFloat(quote["05. price"]);
      const previousClose = parseFloat(quote["08. previous close"]);

      const percentChange =
        !isNaN(price) && !isNaN(previousClose) && previousClose > 0
          ? Number((((price - previousClose) / previousClose) * 100).toFixed(2))
          : 0;

      return {
        name: fallbackName,
        symbol: quote["01. symbol"] || fallbackName,
        price: !isNaN(price) ? price : null,
        previousClose: !isNaN(previousClose) ? previousClose : null,
        percentChange,
        marketState: "REGULAR",
      };
    };

    res.json({
      nifty: mapIndexQuote(niftyResponse, "NIFTY 50"),
      sensex: mapIndexQuote(sensexResponse, "SENSEX"),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching indices from Alpha Vantage:", error.message);
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
  console.log(`✅ Indian Stocks Proxy Server running on port ${port}`);
  console.log(`📊 Using Alpha Vantage API for stock data`);
  console.log(`⚡ Rate limit: 5 calls/minute (free tier)`);
});
