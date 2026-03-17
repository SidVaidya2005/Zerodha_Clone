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
