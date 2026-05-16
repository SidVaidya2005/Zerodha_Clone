import React from "react";
import { Link } from "react-router-dom";

function FooterColumn({ heading, links }) {
  return (
    <div className="col-lg-2 col-md-3 col-6 mb-4">
      <p className="app-footer-col-heading">{heading}</p>
      <ul className="app-footer-link-list">
        {links.map((link) => (
          <li key={link.label}>
            {link.internal ? (
              <Link to={link.href} className="app-footer-link">
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="app-footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterColumn;
