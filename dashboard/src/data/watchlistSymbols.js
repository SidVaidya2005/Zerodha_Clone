import { formatPercent } from "../utils/portfolioUtils";

// Seed prices so the watchlist always renders something believable. Symbols the
// price proxy can serve live (Twelve Data free-tier coverage is limited) are
// overridden on each poll; the rest stay near these seeds with subtle drift (see
// useWatchlistPolling). Values are approximate recent NSE prices — edit freely.
const seed = (name, price, previousClose) => {
  const percentChange = previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0;
  return {
    name,
    price,
    previousClose,
    percent: formatPercent(percentChange),
    isDown: price < previousClose,
    isIndian: true,
  };
};

export const INITIAL_WATCHLIST = [
  seed("HDFCBANK", 1702.4, 1695.0),
  seed("RELIANCE", 2948.0, 2970.5),
  seed("ICICIBANK", 1251.3, 1244.0),
  seed("INFY", 1197.5, 1201.3),
  seed("ITC", 431.2, 429.0),
  seed("TCS", 3902.6, 3940.0),
  seed("LT", 3615.0, 3598.5),
  seed("BHARTIARTL", 1602.8, 1610.0),
  seed("AXISBANK", 1148.5, 1141.0),
  seed("SBIN", 831.4, 835.0),
];
