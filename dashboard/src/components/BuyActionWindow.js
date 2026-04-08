import React, { useContext, useEffect, useRef, useState } from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";
import { BACKEND_URL } from "../config";
import { parseNumericPrice, formatPrice } from "./portfolioUtils";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, price }) => {
  const generalContext = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const stockPrice = price || 0;
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const placeOrder = async (mode) => {
    try {
      await axios.post(`${BACKEND_URL}/newOrder`, {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode,
      });

      setToast({
        visible: true,
        type: "success",
        message: `${mode} order placed!`,
      });

      closeTimerRef.current = setTimeout(() => {
        generalContext.closeBuyWindow();
      }, 900);
    } catch (error) {
      console.error("Failed to place order", error);
      setToast({
        visible: true,
        type: "error",
        message: "Order failed. Please retry.",
      });
    }
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <p className="baw-stock-info">
          <strong className="baw-stock-name">{uid}</strong>
          {stockPrice > 0 && (
            <span className="baw-stock-price">@ ₹{formatPrice(stockPrice)}</span>
          )}
        </p>
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{stockPrice > 0 ? formatPrice(parseNumericPrice(stockPrice) * stockQuantity) : "--"}</span>
        <div>
          <button type="button" className="btn btn-blue" onClick={() => placeOrder("BUY")}>
            Buy
          </button>
          <button type="button" className="btn btn-red" onClick={() => placeOrder("SELL")}>
            Sell
          </button>
          <button type="button" className="btn btn-grey" onClick={generalContext.closeBuyWindow}>
            Cancel
          </button>
        </div>
      </div>

      {toast.visible && (
        <div
          className={`order-toast ${
            toast.type === "success"
              ? "order-toast-success"
              : "order-toast-error"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default BuyActionWindow;
