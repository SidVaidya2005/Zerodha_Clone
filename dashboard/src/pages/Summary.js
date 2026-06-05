import React from "react";
import { usePortfolioSummary } from "../hooks/usePortfolioSummary";
import { useCurrentUser } from "../hooks/useCurrentUser";

const formatCompact = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const Summary = () => {
  const user = useCurrentUser();
  const {
    investment,
    currentValue,
    pnl,
    pnlPercent,
    marginsUsed,
    holdingsCount,
    isLoading,
    hasError,
  } = usePortfolioSummary();

  const pnlClassName = pnl >= 0 ? "profit" : "loss";
  const pnlSign = pnl >= 0 ? "+" : "";

  return (
    <div className="summary-page">
      <h1 className="summary-greeting">Hi, {user.fullName}!</h1>

      {isLoading && <p className="summary-banner">Refreshing summary...</p>}
      {hasError && (
        <p className="summary-banner summary-banner--error">
          Unable to load live summary right now.
        </p>
      )}

      <section className="summary-card">
        <h2 className="summary-card-title">Equity</h2>
        <div className="summary-card-body">
          <div className="summary-hero">
            <span className="summary-hero-value">₹{formatCompact(currentValue)}</span>
            <span className="summary-hero-label">Margin available</span>
          </div>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="summary-stat-label">Margins used</span>
              <span className="summary-stat-value">{formatCompact(marginsUsed)}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-stat-label">Opening balance</span>
              <span className="summary-stat-value">{formatCompact(investment)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="summary-card">
        <h2 className="summary-card-title">Holdings ({holdingsCount})</h2>
        <div className="summary-card-body">
          <div className="summary-hero">
            <span className={`summary-hero-value ${pnlClassName}`}>
              {formatCompact(pnl)} <small>{`${pnlSign}${pnlPercent.toFixed(2)}%`}</small>
            </span>
            <span className="summary-hero-label">P&L</span>
          </div>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="summary-stat-label">Current value</span>
              <span className="summary-stat-value">{formatCompact(currentValue)}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-stat-label">Investment</span>
              <span className="summary-stat-value">{formatCompact(investment)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Summary;
