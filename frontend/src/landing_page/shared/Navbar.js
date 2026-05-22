import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../data/navItems";

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-expand-lg border-bottom app-navbar sticky-top">
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img src="media/images/logo.svg" className="app-navbar-logo" alt="Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex align-items-center ms-auto" role="search">
            <ul className="navbar-nav mb-lg-0">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.to;

                return (
                  <li className="nav-item" key={item.to}>
                    <Link
                      className={`nav-link ${isActive ? "active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      to={item.to}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
