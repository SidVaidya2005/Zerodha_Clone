import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Pricing() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-4">
          <h1 className="mb-3 fs-2">Unbeatable pricing</h1>
          <p>
            We pioneered the concept of discount broking and price transparency in India. Flat fees
            and no hidden charges.
          </p>
          <Link to="/pricing" className="app-link-plain">
            See Pricing <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="d-none d-md-block col-md-2"></div>
        <div className="col-12 col-md-6 mb-5">
          <div className="row text-center">
            <div className="col app-pricing-box">
              <h1 className="mb-3">₹0</h1>
              <p>
                Free equity delivery and
                <br />
                direct mutual funds
              </p>
            </div>
            <div className="col app-pricing-box">
              <h1 className="mb-3">₹20</h1>
              <p>Intraday and F&O</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
