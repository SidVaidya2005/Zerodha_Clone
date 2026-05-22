import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Education() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 col-md-6">
          <img src="media/images/education.svg" className="app-w-70" />
        </div>
        <div className="col-12 col-md-6">
          <h1 className="mb-3 fs-2">Free and open market education</h1>
          <p>
            Varsity, the largest online stock market education book in the world covering everything
            from the basics to advanced trading.
          </p>
          <Link to="/product" className="app-link-plain">
            Varsity <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <p className="mt-5">
            TradingQ&A, the most active trading and investment community in India for all your
            market related queries.
          </p>
          <Link to="/support" className="app-link-plain">
            Trading Q&A <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Education;
