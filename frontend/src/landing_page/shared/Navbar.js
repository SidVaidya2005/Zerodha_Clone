import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../data/navItems";
import { GOOGLE_AUTH_URL } from "../../config";

function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignUp = () => {
    // No dedicated /signup page exists; the single CTA starts the server-side
    // Google OAuth flow, which sets the auth cookie and redirects to the dashboard.
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <nav
      className={`navbar navbar-expand-lg app-navbar sticky-top ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
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
            <li className="nav-item">
              <button
                type="button"
                onClick={handleSignUp}
                className="btn app-navbar-cta"
              >
                Sign up
                <span className="app-navbar-cta-arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
