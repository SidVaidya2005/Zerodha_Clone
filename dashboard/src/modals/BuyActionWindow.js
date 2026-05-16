import React, { useContext, useState } from "react";

import GeneralContext from "../context/GeneralContext";
import { useSubmitOrder } from "../hooks/useSubmitOrder";
import { parseNumericPrice, formatPrice } from "../utils/portfolioUtils";

const BuyActionWindow = ({ uid, price }) => {
  const generalContext = useContext(GeneralContext);
  const { submit, toast } = useSubmitOrder();

  const [stockQuantity, setStockQuantity] = useState(1);
  const stockPrice = price || 0;

  const placeOrder = (mode) => {
    submit({ name: uid, qty: stockQuantity, price: stockPrice, mode });
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
        <span>
          Margin required ₹
          {stockPrice > 0
            ? formatPrice(parseNumericPrice(stockPrice) * stockQuantity)
            : "--"}
        </span>
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
