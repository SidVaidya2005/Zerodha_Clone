import React from "react";
import { getPnL, getProfitClass, getDayClass } from "./portfolioUtils";
import { useApiData } from "../hooks/useApiData";
import { BACKEND_URL } from "../config";

const Positions = () => {
  const { data: positions, isLoading, error: errorMessage } = useApiData(
    `${BACKEND_URL}/allPositions`,
    "Unable to load positions. Make sure the backend is running."
  );

  if (isLoading) {
    return <p className="positions-message">Loading positions...</p>;
  }

  if (errorMessage) {
    return <p className="positions-message positions-message--error">{errorMessage}</p>;
  }

  if (positions.length === 0) {
    return <p className="positions-message">No open positions.</p>;
  }

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>

          {positions.map((stock) => {
            const pnl = getPnL(stock);
            const profitClass = getProfitClass(pnl);
            const dayClass = getDayClass(stock.isLoss);

            return (
              <tr key={`${stock.product}-${stock.name}`}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{typeof stock.avg === "number" ? stock.avg.toFixed(2) : "-"}</td>
                <td>{typeof stock.price === "number" ? stock.price.toFixed(2) : "-"}</td>
                <td className={profitClass}>{pnl.toFixed(2)}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Positions;
