export function getCurrentValue(stock) {
  return stock.price * stock.qty;
}

export function getPnL(stock) {
  return getCurrentValue(stock) - stock.avg * stock.qty;
}

export function getProfitClass(pnl) {
  return pnl >= 0 ? "profit" : "loss";
}

export function getDayClass(isLoss) {
  return isLoss ? "loss" : "profit";
}

export function parseNumericPrice(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function formatPrice(value) {
  return parseNumericPrice(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "--";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}
