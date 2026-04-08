import React from "react";
import { Link } from "react-router-dom";

const footerColumns = [
  {
    heading: "Account",
    links: [
      { label: "Open demat account", href: "/signup", internal: true },
      { label: "Minor demat account", href: "https://zerodha.com/open-account/", internal: false },
      { label: "Fund transfer", href: "https://zerodha.com/charges/", internal: false },
      { label: "Referral program", href: "https://zerodha.com/referral/", internal: false },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact us", href: "/support", internal: true },
      { label: "Bulletin", href: "https://zerodha.com/bulletin/", internal: false },
      { label: "Circular", href: "https://zerodha.com/circulars/", internal: false },
      { label: "Downloads", href: "https://zerodha.com/downloads/", internal: false },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about", internal: true },
      { label: "Careers", href: "https://zerodha.com/careers/", internal: false },
      { label: "Zerodha.tech", href: "https://zerodha.tech/", internal: false },
      { label: "Open source", href: "https://github.com/zerodhatech", internal: false },
    ],
  },
  {
    heading: "Quick links",
    links: [
      { label: "Upcoming IPOs", href: "https://zerodha.com/ipo/", internal: false },
      { label: "Brokerage charges", href: "/pricing", internal: true },
      { label: "Market holidays", href: "https://zerodha.com/marketholidays/", internal: false },
      { label: "Economic calendar", href: "https://zerodha.com/economicCalendar/", internal: false },
    ],
  },
];

const socialLinks = [
  { icon: "fa-brands fa-x-twitter", href: "https://x.com/zerodha", label: "X (Twitter)" },
  { icon: "fa-brands fa-facebook", href: "https://facebook.com/zerodha.social", label: "Facebook" },
  { icon: "fa-brands fa-instagram", href: "https://instagram.com/zerodhaonline/", label: "Instagram" },
  { icon: "fa-brands fa-linkedin", href: "https://linkedin.com/company/zerodha", label: "LinkedIn" },
  { icon: "fa-brands fa-youtube", href: "https://www.youtube.com/@zerodhaonline", label: "YouTube" },
  { icon: "fa-brands fa-whatsapp", href: "https://whatsapp.com/channel/0029Va8tzF0EquiIIb9j791g", label: "WhatsApp" },
  { icon: "fa-brands fa-telegram", href: "https://t.me/zerodhain", label: "Telegram" },
];

const legalParagraphs = [
  `Zerodha Broking Ltd. | SEBI Regn. no.: INZ000031633 | Registered Office: #153/154, 4th Cross, Dollars Colony, J.P Nagar 4th Phase, Bengaluru - 560078. For complaints, write to complaints@zerodha.com (broking) or dp@zerodha.com (DP).`,
  `Investments in securities market are subject to market risks. Read all related documents carefully before investing. Prevent unauthorised transactions by keeping your mobile number and email updated with your broker.`,
];

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
              {socialLinks.map((social) => (
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

          {footerColumns.map((column) => (
            <div className="col-lg-2 col-md-3 col-6 mb-4" key={column.heading}>
              <p className="app-footer-col-heading">{column.heading}</p>
              <ul className="app-footer-link-list">
                {column.links.map((link) => (
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
          ))}
        </div>

        <div className="mt-4 border-top pt-4 text-muted app-footnote-text">
          {legalParagraphs.map((paragraph, index) => (
            <p key={`legal-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
