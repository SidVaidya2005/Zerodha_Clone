import React, { useContext } from "react";
import { Tooltip, Grow } from "@mui/material";
import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";

import BuyWindowContext from "../../context/BuyWindowContext";
import { parseNumericPrice } from "../../utils/portfolioUtils";

const WatchListActions = ({ uid, stock, onAnalyticsClick }) => {
  const buyWindow = useContext(BuyWindowContext);

  const openWindow = () => {
    buyWindow.openBuyWindow(uid, parseNumericPrice(stock.price));
  };

  return (
    <span className="actions">
      <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
        <button className="buy" onClick={openWindow}>
          Buy
        </button>
      </Tooltip>
      <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
        <button className="sell" onClick={openWindow}>
          Sell
        </button>
      </Tooltip>
      <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
        <button className="action" onClick={() => onAnalyticsClick(stock)}>
          <BarChartOutlined className="icon" />
        </button>
      </Tooltip>
      <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
        <button className="action">
          <MoreHoriz className="icon" />
        </button>
      </Tooltip>
    </span>
  );
};

export default WatchListActions;
