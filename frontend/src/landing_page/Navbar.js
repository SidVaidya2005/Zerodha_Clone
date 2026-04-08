import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/signup", label: "Signup" },
  { to: "/about", label: "About" },
  { to: "/product", label: "Product" },
  { to: "/pricing", label: "Pricing" },
  { to: "/support", label: "Support" },
];

function Navbar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-expand-lg border-bottom app-navbar sticky-top">
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img
            src="media/images/logo.svg"
            className="app-navbar-logo dark-invert"
            alt="Logo"
          />
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
              {navItems.map((item) => {
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
            <button
              type="button"
              className="ms-3 theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              <span className="theme-icon-stack" aria-hidden="true">
                <i
                  className={`fa-regular fa-moon theme-icon ${
                    theme === "light" ? "is-visible" : "is-hidden"
                  }`}
                ></i>
                <i
                  className={`fa-solid fa-moon theme-icon ${
                    theme === "dark" ? "is-visible" : "is-hidden"
                  }`}
                ></i>
              </span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
