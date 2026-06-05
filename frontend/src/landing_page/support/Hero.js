import React from "react";
import { Search } from "lucide-react";
import { GOOGLE_AUTH_URL } from "../../config";

function Hero({ query, onQueryChange }) {
  return (
    <section className="support-hero-section">
      <div className="container">
        <div className="support-header py-4">
          <h2 className="support-title mb-0">Support Portal</h2>
          <a href={GOOGLE_AUTH_URL} className="btn btn-primary px-4 py-2">
            Go to dashboard
          </a>
        </div>
        <div className="support-search-container pb-5">
          <div className="support-search-wrapper">
            <Search className="search-icon" size={18} aria-hidden="true" />
            <input
              type="text"
              className="support-search-input-new"
              placeholder="Search help topics — e.g. orders, live prices, sign in…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Search help topics"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
