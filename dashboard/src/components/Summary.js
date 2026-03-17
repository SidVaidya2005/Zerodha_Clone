import React, { useEffect, useMemo, useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { BACKEND_URL } from "../config";

const Summary = () => {
  const [userName, setUserName] = useState("User");
  const {
    data: holdings,
    isLoading,
    error: holdingsError,
  } = useApiData(
    `${BACKEND_URL}/allHoldings`,
    "Unable to fetch summary data.",
    15000,
  );
  const { data: positions, error: positionsError } = useApiData(
    `${BACKEND_URL}/allPositions`,
    "Unable to fetch summary data.",
    15000,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name");
    if (nameParam) {
      setUserName(nameParam);
    }
  }, []);

  const formatCompact = (value) =>
    new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);

  const summary = useMemo(() => {
    const investment = holdings.reduce(
      (total, item) => total + (item.avg || 0) * (item.qty || 0),
      0,
    );

    const currentValue = holdings.reduce(
      (total, item) => total + (item.price || 0) * (item.qty || 0),
      0,
    );

    const pnl = currentValue - investment;
    const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;

    const marginsUsed = positions.reduce(
      (total, item) => total + Math.abs((item.price || 0) * (item.qty || 0)),
      0,
    );

    return {
      investment,
      currentValue,
      pnl,
      pnlPercent,
      marginsUsed,
      holdingsCount: holdings.length,
    };
  }, [holdings, positions]);

  const hasError = Boolean(holdingsError || positionsError);
  const pnlClassName = summary.pnl >= 0 ? "profit" : "loss";
  const pnlSign = summary.pnl >= 0 ? "+" : "";

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
            <h3>{formatCompact(summary.currentValue)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used{" "}
              <span>{formatCompact(summary.marginsUsed)}</span>{" "}
            </p>
            <p>
              Opening balance{" "}
              <span>{formatCompact(summary.investment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({summary.holdingsCount})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClassName}>
              {formatCompact(summary.pnl)}{" "}
              <small>{`${pnlSign}${summary.pnlPercent.toFixed(2)}%`}</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value{" "}
              <span>{formatCompact(summary.currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>{formatCompact(summary.investment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
