import React, { useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

import WatchListActions from "./WatchListActions";
import { formatPrice } from "../../utils/portfolioUtils";

const WatchListItem = ({ stock, onAnalyticsClick }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="item-info">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{formatPrice(stock.price)}</span>
        </div>
      </div>
      {showWatchlistActions && (
        <WatchListActions uid={stock.name} stock={stock} onAnalyticsClick={onAnalyticsClick} />
      )}
    </li>
  );
};

export default WatchListItem;
