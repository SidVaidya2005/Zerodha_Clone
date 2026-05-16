import React from "react";
import { formatPrice } from "../../utils/portfolioUtils";

const AnalyticsModal = ({ stock, onClose }) => {
  return (
    <div className="analytics-overlay" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-header">
          <h4>{stock.name} Analytics</h4>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="analytics-body">
          <div className="stat-row">
            <span>Current Price</span>
            <strong>₹{formatPrice(stock.price)}</strong>
          </div>
          <div className="stat-row">
            <span>Day Change</span>
            <strong className={stock.isDown ? "down" : "up"}>{stock.percent}</strong>
          </div>
          <div className="stat-row">
            <span>Market</span>
            <strong>{stock.isIndian ? "Indian (NSE/BSE)" : "Global"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
