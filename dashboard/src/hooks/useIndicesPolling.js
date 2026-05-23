import { useState, useEffect } from "react";
import { PROXY_URL } from "../config";
import { formatPercent } from "../utils/portfolioUtils";

const POLL_INTERVAL_MS = 60_000;

const INITIAL_INDICES = {
  nifty: { price: "22,040.70", percent: "+0.15%", isDown: false },
  sensex: { price: "72,643.43", percent: "-0.10%", isDown: true },
};

const formatIndexPoint = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "--";
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

let rateLimitLoggedForSession = false;

export function useIndicesPolling() {
  const [indices, setIndices] = useState(INITIAL_INDICES);

  useEffect(() => {
    let skipNext = false;

    const fetchIndices = async () => {
      if (skipNext) {
        skipNext = false;
        return;
      }

      try {
        const response = await fetch(`${PROXY_URL}/api/indices`);
        if (response.status === 429) {
          skipNext = true;
          if (!rateLimitLoggedForSession) {
            rateLimitLoggedForSession = true;
            console.warn("Indices API rate-limited; backing off and holding last-known values.");
          }
          return;
        }
        if (!response.ok) {
          throw new Error(`Indices API failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data?.nifty && data?.sensex) {
          setIndices({
            nifty: {
              price: formatIndexPoint(data.nifty.price),
              percent: formatPercent(data.nifty.percentChange),
              isDown: Number(data.nifty.percentChange) < 0,
            },
            sensex: {
              price: formatIndexPoint(data.sensex.price),
              percent: formatPercent(data.sensex.percentChange),
              isDown: Number(data.sensex.percentChange) < 0,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching indices:", error);
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return { indices };
}
