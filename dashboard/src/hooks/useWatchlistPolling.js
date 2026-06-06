import { useState, useEffect } from "react";
import { PROXY_URL } from "../config";
import { parseNumericPrice, formatPercent } from "../utils/portfolioUtils";
import { INITIAL_WATCHLIST } from "../data/watchlistSymbols";

const POLL_INTERVAL_MS = 15000;

// Subtle random walk for seeded (non-live) symbols so the list feels alive.
// Bounded within ±2% of the baseline (previousClose) so it never wanders far.
const DRIFT_STEP = 0.001; // up to ±0.1% per tick
const DRIFT_BAND = 0.02; // stay within ±2% of the baseline
function driftPrice(current, baseline) {
  const step = current * DRIFT_STEP * (Math.random() * 2 - 1);
  let next = current + step;
  const low = baseline * (1 - DRIFT_BAND);
  const high = baseline * (1 + DRIFT_BAND);
  if (next < low) next = low;
  if (next > high) next = high;
  return Number(next.toFixed(2));
}

function withPrice(stock, price, previousClose) {
  const percentChange = previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0;
  return {
    ...stock,
    price,
    previousClose,
    percent: formatPercent(percentChange),
    isDown: price < previousClose,
  };
}

export function useWatchlistPolling() {
  const [liveWatchlist, setLiveWatchlist] = useState(INITIAL_WATCHLIST);

  useEffect(() => {
    const fetchIndianStocks = async () => {
      const indianSymbols = INITIAL_WATCHLIST.map((s) => s.name);
      if (indianSymbols.length === 0) return;

      // Collect whatever the proxy can serve live (free tier covers only some
      // symbols); everything else falls through to seed + drift below.
      const liveBySymbol = new Map();
      try {
        const response = await fetch(
          `${PROXY_URL}/api/indian-stocks?symbols=${indianSymbols.join(",")}`
        );
        if (!response.ok) {
          throw new Error(`Proxy request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid payload from stock proxy");
        }
        data.forEach((item) => {
          if (!item.error && item.data && typeof item.data.close === "number") {
            liveBySymbol.set(item.symbol, item.data);
          }
        });
      } catch (error) {
        // Proxy unreachable/failed: no live data this cycle; seeded symbols
        // still drift so the watchlist keeps moving.
        console.error("Error fetching Indian stocks proxy:", error);
      }

      setLiveWatchlist((prev) =>
        prev.map((stock) => {
          const live = liveBySymbol.get(stock.name);
          if (live) {
            const newPrice = live.close;
            const prevClose =
              typeof live.previousClose === "number"
                ? live.previousClose
                : typeof live.open === "number"
                  ? live.open
                  : newPrice;
            return withPrice(stock, newPrice, prevClose);
          }
          // Seeded symbol → subtle drift around its fixed baseline.
          const baseline =
            typeof stock.previousClose === "number"
              ? stock.previousClose
              : parseNumericPrice(stock.price);
          const drifted = driftPrice(parseNumericPrice(stock.price), baseline);
          return withPrice(stock, drifted, baseline);
        })
      );
    };

    fetchIndianStocks();
    const indiaInterval = setInterval(fetchIndianStocks, POLL_INTERVAL_MS);

    return () => clearInterval(indiaInterval);
  }, []);

  return { liveWatchlist };
}
