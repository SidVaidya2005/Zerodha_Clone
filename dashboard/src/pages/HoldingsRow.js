import React from "react";
import {
  getCurrentValue,
  getProfitClass,
  getDayClass,
} from "../utils/portfolioUtils";

const HoldingsRow = ({ stock }) => {
  const currentValue = getCurrentValue(stock);
  const profitClass = getProfitClass(stock.pnl);
  const dayClass = getDayClass(stock.isLoss);

  return (
    <tr>
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
};

export default HoldingsRow;
