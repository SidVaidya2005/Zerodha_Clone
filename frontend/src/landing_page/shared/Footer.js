import React from "react";
import FooterColumn from "../components/FooterColumn";
import {
  FOOTER_COLUMNS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_LEGAL_PARAGRAPHS,
} from "../../data/footerLinks";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container border-top mt-4">
        <div className="row mt-3">
          <div className="col-lg-4 col-md-6 mb-4">
            <img src="media/images/logo.svg" className="app-footer-logo" alt="Zerodha logo" />
            <p className="app-footer-tagline">
              A full-stack Zerodha clone built with React, Express &amp; MongoDB.
            </p>
            <p className="app-footer-copyright">&copy; 2026 Siddarth Vaidya</p>
            <div className="app-footer-social">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="app-footer-social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column, index) => (
            <FooterColumn
              key={column.heading}
              heading={column.heading}
              links={column.links}
              className={index === 0 ? "ms-lg-auto" : ""}
            />
          ))}
        </div>

        <div className="mt-3 border-top pt-3 app-footnote-text">
          {FOOTER_LEGAL_PARAGRAPHS.map((paragraph, index) => (
            <p key={`legal-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
