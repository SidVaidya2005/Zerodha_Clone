import React, { useState, useContext, useMemo } from "react";

import GeneralContext from "../../context/GeneralContext";
import { parseNumericPrice, formatPrice } from "../../utils/portfolioUtils";
import { BACKGROUND_COLORS, BORDER_COLORS } from "../../data/chartPalette";
import { useWatchlistPolling } from "../../hooks/useWatchlistPolling";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { DoughnutChart } from "../../charts/DoughnutChart";

const WatchList = () => {
  const { liveWatchlist } = useWatchlistPolling();
  const [analyticsStock, setAnalyticsStock] = useState(null);

  const data = useMemo(() => {
    const totalPrice = liveWatchlist.reduce(
      (acc, stock) => acc + parseNumericPrice(stock.price),
      0,
    );

    const labels = liveWatchlist.map((stock) => {
      const price = parseNumericPrice(stock.price);
      const percentage =
        totalPrice > 0 ? ((price / totalPrice) * 100).toFixed(2) : 0;
      return `${stock.name}: ${percentage}%`;
    });

    const dataPoints = liveWatchlist.map((stock) =>
      parseNumericPrice(stock.price),
    );

    return {
      labels,
      datasets: [
        {
          label: "Price",
          data: dataPoints,
          backgroundColor: BACKGROUND_COLORS,
          borderColor: BORDER_COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [liveWatchlist]);

  return (
    <div className="watchlist-container">
      <ul className="list">
        {liveWatchlist.map((stock) => (
          <WatchListItem
            stock={stock}
            key={stock.name}
            onAnalyticsClick={setAnalyticsStock}
          />
        ))}
      </ul>

      <DoughnutChart data={data} />

      {analyticsStock && (
        <div
          className="analytics-overlay"
          onClick={() => setAnalyticsStock(null)}
        >
          <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
            <div className="analytics-header">
              <h4>{analyticsStock.name} Analytics</h4>
              <button
                className="close-btn"
                onClick={() => setAnalyticsStock(null)}
              >
                ✕
              </button>
            </div>
            <div className="analytics-body">
              <div className="stat-row">
                <span>Current Price</span>
                <strong>₹{formatPrice(analyticsStock.price)}</strong>
              </div>
              <div className="stat-row">
                <span>Day Change</span>
                <strong className={analyticsStock.isDown ? "down" : "up"}>
                  {analyticsStock.percent}
                </strong>
              </div>
              <div className="stat-row">
                <span>Market</span>
                <strong>
                  {analyticsStock.isIndian ? "Indian (NSE/BSE)" : "Global"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchList;

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
        <WatchListActions
          uid={stock.name}
          stock={stock}
          onAnalyticsClick={onAnalyticsClick}
        />
      )}
    </li>
  );
};

const WatchListActions = ({ uid, stock, onAnalyticsClick }) => {
  const generalContext = useContext(GeneralContext);

  const openWindow = () => {
    generalContext.openBuyWindow(uid, parseNumericPrice(stock.price));
  };

  return (
    <span className="actions">
      <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
        <button className="buy" onClick={openWindow}>Buy</button>
      </Tooltip>
      <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
        <button className="sell" onClick={openWindow}>Sell</button>
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
