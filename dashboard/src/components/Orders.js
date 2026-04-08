import React from "react";
import { Link } from "react-router-dom";
import { useApiData } from "../hooks/useApiData";
import { BACKEND_URL } from "../config";

const OrdersShell = ({ children }) => (
  <div className="orders">
    <div className="no-orders">{children}</div>
  </div>
);

const Orders = () => {
  const { data: allOrders, isLoading, error: errorMessage } = useApiData(
    `${BACKEND_URL}/allOrders`,
    "Unable to load orders. Make sure the backend is running."
  );

  if (isLoading) {
    return <OrdersShell><p>Loading orders...</p></OrdersShell>;
  }

  if (errorMessage) {
    return <OrdersShell><p>{errorMessage}</p></OrdersShell>;
  }

  if (allOrders.length === 0) {
    return (
      <OrdersShell>
        <p>You haven't placed any orders today</p>
        <Link to="/" className="btn btn-blue">Get started</Link>
      </OrdersShell>
    );
  }

  return (
    <div className="orders">
      <h3 className="title">Orders ({allOrders.length})</h3>
      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Price (₹)</th>
            <th>Type</th>
            <th>Time</th>
          </tr>
          {allOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.name}</td>
              <td>{order.qty}</td>
              <td>{order.price > 0 ? order.price.toFixed(2) : "Market"}</td>
              <td>
                <span className={order.mode === "BUY" ? "order-mode-badge order-mode-buy" : "order-mode-badge order-mode-sell"}>
                  {order.mode}
                </span>
              </td>
              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                    })
                  : "-"}
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Orders;
