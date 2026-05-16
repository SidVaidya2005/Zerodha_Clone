import React, { useMemo } from "react";
import { VerticalGraph } from "../charts/VerticalGraph";
import { getProfitClass } from "../utils/portfolioUtils";
import { useHoldingsSummary } from "../hooks/useHoldingsSummary";
import HoldingsRow from "./HoldingsRow";

const Holdings = () => {
  const {
    holdingsWithPnL,
    holdingsCount,
    isLoading,
    errorMessage,
    totalPnL,
    bestPerformer,
    worstPerformer,
    totalInvestment,
    totalCurrentValue,
  } = useHoldingsSummary();

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
    [holdingsWithPnL]
  );

  return (
    <>
      <h3 className="title">Holdings ({holdingsCount})</h3>

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
          <h5 className="quick-stat-value">{holdingsCount}</h5>
        </div>
        <div className="quick-stat-card">
          <p className="quick-stat-label">Total P&amp;L</p>
          <h5 className={`quick-stat-value ${getProfitClass(totalPnL)}`}>{totalPnL.toFixed(2)}</h5>
        </div>
        <div className="quick-stat-card">
          <p className="quick-stat-label">Best performer</p>
          <h5 className="quick-stat-value">
            {bestPerformer ? `${bestPerformer.name} (${bestPerformer.pnl.toFixed(2)})` : "-"}
          </h5>
        </div>
        <div className="quick-stat-card">
          <p className="quick-stat-label">Worst performer</p>
          <h5 className="quick-stat-value">
            {worstPerformer ? `${worstPerformer.name} (${worstPerformer.pnl.toFixed(2)})` : "-"}
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

          {holdingsWithPnL.map((stock) => (
            <HoldingsRow key={stock.name} stock={stock} />
          ))}
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
              <small>
                ({totalPnL >= 0 ? "+" : ""}
                {((totalPnL / totalInvestment) * 100).toFixed(2)}%)
              </small>
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
