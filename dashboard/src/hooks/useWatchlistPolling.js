import { useState, useEffect } from "react";
import { PROXY_URL } from "../config";
import { parseNumericPrice, formatPercent } from "../utils/portfolioUtils";
import { INITIAL_WATCHLIST } from "../data/watchlistSymbols";

const POLL_INTERVAL_MS = 15000;

export function useWatchlistPolling() {
  const [liveWatchlist, setLiveWatchlist] = useState(INITIAL_WATCHLIST);

  useEffect(() => {
    const fetchIndianStocks = async () => {
      const indianSymbols = INITIAL_WATCHLIST.map((s) => s.name);
      if (indianSymbols.length === 0) return;

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

        setLiveWatchlist((prev) => {
          const updatedList = [...prev];
          let changed = false;

          data.forEach((item) => {
            if (!item.error && item.data) {
              const stockIndex = updatedList.findIndex((s) => s.name === item.symbol);
              if (stockIndex !== -1) {
                const oldPrice = parseNumericPrice(updatedList[stockIndex].price);
                const newPrice = typeof item.data.close === "number" ? item.data.close : oldPrice;

                if (newPrice === oldPrice) return;

                const prevClose =
                  typeof item.data.previousClose === "number"
                    ? item.data.previousClose
                    : typeof item.data.open === "number"
                      ? item.data.open
                      : oldPrice;

                const percentChange =
                  prevClose > 0 ? ((newPrice - prevClose) / prevClose) * 100 : 0;

                updatedList[stockIndex] = {
                  ...updatedList[stockIndex],
                  price: newPrice,
                  percent: formatPercent(percentChange),
                  isDown: newPrice < prevClose,
                };
                changed = true;
              }
            }
          });

          return changed ? updatedList : prev;
        });
      } catch (error) {
        console.error("Error fetching Indian stocks proxy:", error);
      }
    };

    fetchIndianStocks();
    const indiaInterval = setInterval(fetchIndianStocks, POLL_INTERVAL_MS);

    return () => clearInterval(indiaInterval);
  }, []);

  return { liveWatchlist };
}
