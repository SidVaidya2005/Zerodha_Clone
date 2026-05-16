import React, { useEffect, useState } from "react";
import { usePortfolioSummary } from "../hooks/usePortfolioSummary";

const formatCompact = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const Summary = () => {
  const [userName, setUserName] = useState("User");
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name");
    if (nameParam) {
      setUserName(nameParam);
    }
  }, []);

  const pnlClassName = pnl >= 0 ? "profit" : "loss";
  const pnlSign = pnl >= 0 ? "+" : "";

  return (
    <>
      <div className="username">
        <h6>Hi, {userName}!</h6>
        <hr className="divider" />
      </div>

      {isLoading && <p className="positions-message">Refreshing summary...</p>}
      {hasError && (
        <p className="positions-message positions-message--error">
          Unable to load live summary right now.
        </p>
      )}

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatCompact(currentValue)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>{formatCompact(marginsUsed)}</span>{" "}
            </p>
            <p>
              Opening balance <span>{formatCompact(investment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdingsCount})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClassName}>
              {formatCompact(pnl)}{" "}
              <small>{`${pnlSign}${pnlPercent.toFixed(2)}%`}</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{formatCompact(currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>{formatCompact(investment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
