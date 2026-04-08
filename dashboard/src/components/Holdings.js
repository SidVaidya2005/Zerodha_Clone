import React, { useMemo } from "react";
import { VerticalGraph } from "./VerticalGraph";
import {
  getCurrentValue,
  getPnL,
  getProfitClass,
  getDayClass,
} from "./portfolioUtils";
import { useApiData } from "../hooks/useApiData";
import { BACKEND_URL } from "../config";

const Holdings = () => {
  const { data: allHoldings, isLoading, error: errorMessage } = useApiData(
    `${BACKEND_URL}/allHoldings`,
    "Unable to load holdings right now. Please try again."
  );

  const holdingsWithPnL = useMemo(
    () =>
      allHoldings.map((stock) => ({
        ...stock,
        pnl: getPnL(stock),
      })),
    [allHoldings],
  );

  const { totalPnL, bestPerformer, worstPerformer, totalInvestment, totalCurrentValue } = useMemo(() => {
    if (holdingsWithPnL.length === 0) {
      return { totalPnL: 0, bestPerformer: null, worstPerformer: null, totalInvestment: 0, totalCurrentValue: 0 };
    }

    let total = 0;
    let investment = 0;
    let currentValue = 0;
    let best = holdingsWithPnL[0];
    let worst = holdingsWithPnL[0];

    holdingsWithPnL.forEach((stock) => {
      total += stock.pnl;
      investment += stock.avg * stock.qty;
      currentValue += getCurrentValue(stock);
      if (stock.pnl > best.pnl) best = stock;
      if (stock.pnl < worst.pnl) worst = stock;
    });

    return { totalPnL: total, bestPerformer: best, worstPerformer: worst, totalInvestment: investment, totalCurrentValue: currentValue };
  }, [holdingsWithPnL]);

  const data = useMemo(
    () => ({
      labels: holdingsWithPnL.map((stock) => stock.name),
      datasets: [
        {
          label: "Stock Price",
          data: holdingsWithPnL.map((stock) => stock.price),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    }),
    [holdingsWithPnL],
  );

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {isLoading && (
        <div className="holdings-feedback">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="quick-stats-grid">
        <div className="quick-stat-card">
          <p className="quick-stat-label">Total holdings</p>
          <h5 className="quick-stat-value">{allHoldings.length}</h5>
        </div>
        <div className="quick-stat-card">
          <p className="quick-stat-label">Total P&amp;L</p>
          <h5 className={`quick-stat-value ${getProfitClass(totalPnL)}`}>
            {totalPnL.toFixed(2)}
          </h5>
        </div>
        <div className="quick-stat-card">
          <p className="quick-stat-label">Best performer</p>
          <h5 className="quick-stat-value">
            {bestPerformer
              ? `${bestPerformer.name} (${bestPerformer.pnl.toFixed(2)})`
              : "-"}
          </h5>
        </div>
        <div className="quick-stat-card">
          <p className="quick-stat-label">Worst performer</p>
          <h5 className="quick-stat-value">
            {worstPerformer
              ? `${worstPerformer.name} (${worstPerformer.pnl.toFixed(2)})`
              : "-"}
          </h5>
        </div>
      </div>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>

          {holdingsWithPnL.map((stock) => {
            const currentValue = getCurrentValue(stock);
            const profitClass = getProfitClass(stock.pnl);
            const dayClass = getDayClass(stock.isLoss);

            return (
              <tr key={stock.name}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{currentValue.toFixed(2)}</td>
                <td className={profitClass}>{stock.pnl.toFixed(2)}</td>
                <td className={profitClass}>{stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>{totalCurrentValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={getProfitClass(totalPnL)}>
            {totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 2 })}{" "}
            {totalInvestment > 0 && (
              <small>({totalPnL >= 0 ? "+" : ""}{((totalPnL / totalInvestment) * 100).toFixed(2)}%)</small>
            )}
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
