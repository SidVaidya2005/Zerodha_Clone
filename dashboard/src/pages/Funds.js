import React from "react";
import { Link } from "react-router-dom";

const equityTiles = [
  { label: "Used margin", value: "3,757.30" },
  { label: "Available cash", value: "4,043.10" },
  { label: "Opening balance", value: "4,043.10" },
];

const equityDetails = [
  { label: "Payin", value: "4,064.00" },
  { label: "SPAN", value: "0.00" },
  { label: "Delivery margin", value: "0.00" },
  { label: "Exposure", value: "0.00" },
  { label: "Options premium", value: "0.00" },
  { label: "Collateral (Liquid funds)", value: "0.00" },
  { label: "Collateral (Equity)", value: "0.00" },
  { label: "Total collateral", value: "0.00" },
];

const Funds = () => {
  return (
    <div className="funds-page">
      <header className="funds-header">
        <h1 className="funds-title">Funds</h1>
        <div className="funds-header-actions">
          <span className="funds-header-note">Instant, zero-cost fund transfers with UPI</span>
          <Link className="btn btn-green funds-action-btn">Add funds</Link>
          <Link className="btn btn-blue funds-action-btn">Withdraw</Link>
        </div>
      </header>

      <div className="funds-grid">
        <section className="funds-card funds-equity">
          <h2 className="funds-card-title">Equity</h2>

          <div className="funds-hero">
            <span className="funds-hero-label">Available margin</span>
            <span className="funds-hero-value">₹4,043.10</span>
          </div>

          <div className="funds-tiles">
            {equityTiles.map((tile) => (
              <div className="funds-tile" key={tile.label}>
                <span className="funds-tile-label">{tile.label}</span>
                <span className="funds-tile-value">{tile.value}</span>
              </div>
            ))}
          </div>

          <div className="funds-details">
            {equityDetails.map((row) => (
              <div className="funds-detail" key={row.label}>
                <span className="funds-detail-label">{row.label}</span>
                <span className="funds-detail-value">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="funds-card funds-commodity">
          <h2 className="funds-card-title">Commodity</h2>
          <div className="funds-commodity-empty">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue commodity-action-btn">Open Account</Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Funds;
