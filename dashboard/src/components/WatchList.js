import React, { useState, useContext, useEffect, useMemo } from "react";

import GeneralContext from "./GeneralContext";
import { PROXY_URL } from "../config";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { DoughnutChart } from "./DoughnoutChart";

const parseNumericPrice = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatPrice = (value) =>
  parseNumericPrice(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const initialWatchlist = [
  {
    name: "HDFCBANK",
    price: 0,
    percent: "0.00%",
    isDown: false,
    isIndian: true,
  },
  {
    name: "RELIANCE",
    price: 0,
    percent: "0.00%",
    isDown: false,
    isIndian: true,
  },
  {
    name: "ICICIBANK",
    price: 0,
    percent: "0.00%",
    isDown: false,
    isIndian: true,
  },
  { name: "INFY", price: 0, percent: "0.00%", isDown: false, isIndian: true },
  { name: "ITC", price: 0, percent: "0.00%", isDown: false, isIndian: true },
  { name: "TCS", price: 0, percent: "0.00%", isDown: false, isIndian: true },
  { name: "LT", price: 0, percent: "0.00%", isDown: false, isIndian: true },
  {
    name: "BHARTIARTL",
    price: 0,
    percent: "0.00%",
    isDown: false,
    isIndian: true,
  },
  {
    name: "AXISBANK",
    price: 0,
    percent: "0.00%",
    isDown: false,
    isIndian: true,
  },
  { name: "SBIN", price: 0, percent: "0.00%", isDown: false, isIndian: true },
];

const WatchList = () => {
  const [liveWatchlist, setLiveWatchlist] = useState(initialWatchlist);
  const [analyticsStock, setAnalyticsStock] = useState(null);

  useEffect(() => {
    const fetchIndianStocks = async () => {
      const indianSymbols = initialWatchlist.map((s) => s.name);
      if (indianSymbols.length === 0) return;

      try {
        const response = await fetch(
          `${PROXY_URL}/api/indian-stocks?symbols=${indianSymbols.join(",")}`,
        );
        if (!response.ok) {
          throw new Error(
            `Proxy request failed with status ${response.status}`,
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid payload from stock proxy");
        }

        setLiveWatchlist((prev) => {
          let updatedList = [...prev];
          data.forEach((item) => {
            if (!item.error && item.data) {
              const stockIndex = updatedList.findIndex(
                (s) => s.name === item.symbol,
              );
              if (stockIndex !== -1) {
                const oldPrice = parseNumericPrice(
                  updatedList[stockIndex].price,
                );
                const newPrice =
                  typeof item.data.close === "number"
                    ? item.data.close
                    : oldPrice;

                const prevClose =
                  typeof item.data.previousClose === "number"
                    ? item.data.previousClose
                    : typeof item.data.open === "number"
                      ? item.data.open
                      : oldPrice;

                const percentDiff =
                  prevClose > 0
                    ? (((newPrice - prevClose) / prevClose) * 100).toFixed(2)
                    : "0.00";

                updatedList[stockIndex] = {
                  ...updatedList[stockIndex],
                  price: newPrice,
                  percent:
                    parseFloat(percentDiff) > 0
                      ? `+${percentDiff}%`
                      : `${percentDiff}%`,
                  isDown: newPrice < prevClose,
                };
              }
            }
          });
          return updatedList;
        });
      } catch (error) {
        console.error("Error fetching Indian stocks proxy:", error);
      }
    };

    fetchIndianStocks();
    const indiaInterval = setInterval(fetchIndianStocks, 15000);

    return () => clearInterval(indiaInterval);
  }, []);

  const filteredWatchlist = liveWatchlist;

  const data = useMemo(() => {
    const totalPrice = filteredWatchlist.reduce(
      (acc, stock) => acc + parseNumericPrice(stock.price),
      0,
    );

    const labels = filteredWatchlist.map((stock) => {
      const price = parseNumericPrice(stock.price);
      const percentage =
        totalPrice > 0 ? ((price / totalPrice) * 100).toFixed(2) : 0;
      return `${stock.name}: ${percentage}%`;
    });

    const dataPoints = filteredWatchlist.map((stock) =>
      parseNumericPrice(stock.price),
    );

    return {
      labels: labels,
      datasets: [
        {
          label: "Price",
          data: dataPoints,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(199, 199, 199, 0.5)",
            "rgba(83, 102, 255, 0.5)",
            "rgba(40, 159, 64, 0.5)",
            "rgba(210, 199, 199, 0.5)",
            "rgba(78, 52, 199, 0.5)",
            "rgba(155, 99, 132, 0.5)",
            "rgba(54, 162, 135, 0.5)",
            "rgba(255, 206, 186, 0.5)",
            "rgba(255, 120, 120, 0.5)",
            "rgba(120, 255, 120, 0.5)",
            "rgba(120, 120, 255, 0.5)",
            "rgba(255, 255, 120, 0.5)",
            "rgba(255, 120, 255, 0.5)",
            "rgba(120, 255, 255, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(199, 199, 199, 1)",
            "rgba(83, 102, 255, 1)",
            "rgba(40, 159, 64, 1)",
            "rgba(210, 199, 199, 1)",
            "rgba(78, 52, 199, 1)",
            "rgba(155, 99, 132, 1)",
            "rgba(54, 162, 135, 1)",
            "rgba(255, 206, 186, 1)",
            "rgba(255, 120, 120, 1)",
            "rgba(120, 255, 120, 1)",
            "rgba(120, 120, 255, 1)",
            "rgba(255, 255, 120, 1)",
            "rgba(255, 120, 255, 1)",
            "rgba(120, 255, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [filteredWatchlist]);

  return (
    <div className="watchlist-container">
      <ul className="list">
        {filteredWatchlist.map((stock) => {
          return (
            <WatchListItem
              stock={stock}
              key={stock.name}
              onAnalyticsClick={setAnalyticsStock}
            />
          );
        })}
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

  const handleMouseEnter = () => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = () => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="item-info">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
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

  const handleBuyClick = () => {
    const numericPrice = parseNumericPrice(stock.price);
    generalContext.openBuyWindow(uid, numericPrice);
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell" onClick={handleBuyClick}>
            Sell
          </button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
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
    </span>
  );
};
