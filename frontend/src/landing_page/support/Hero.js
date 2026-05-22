import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

function Hero() {
  return (
    <section className="support-hero-section">
      <div className="container">
        <div className="support-header py-4">
          <h2 className="support-title mb-0">Support Portal</h2>
          <Link to="/tickets" className="btn btn-primary px-4 py-2">
            My tickets
          </Link>
        </div>
        <div className="support-search-container pb-5">
          <div className="support-search-wrapper">
            <Search className="search-icon" size={18} aria-hidden="true" />
            <input
              type="text"
              className="support-search-input-new"
              placeholder="Eg: How do I open my account, How do i activate F&O..."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
