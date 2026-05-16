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
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col-lg-3 col-md-6 mb-4">
            <img
              src="media/images/logo.svg"
              className="app-footer-logo dark-invert"
              alt="Zerodha logo"
            />
            <p className="app-footer-copyright">
              &copy; 2010 - 2026, Zerodha Broking Ltd.
              <br />
              All rights reserved.
            </p>
            <div className="app-footer-social">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="app-footer-social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn
              key={column.heading}
              heading={column.heading}
              links={column.links}
            />
          ))}
        </div>

        <div className="mt-4 border-top pt-4 text-muted app-footnote-text">
          {FOOTER_LEGAL_PARAGRAPHS.map((paragraph, index) => (
            <p key={`legal-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
