import React from "react";

const footerColumns = [
  {
    heading: "Account",
    links: [
      "Open demat account",
      "Minor demat account",
      "Fund transfer",
      "Referral program",
    ],
  },
  {
    heading: "Support",
    links: ["Contact us", "Bulletin", "Circular", "Downloads"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Zerodha.tech", "Open source"],
  },
  {
    heading: "Quick links",
    links: [
      "Upcoming IPOs",
      "Brokerage charges",
      "Market holidays",
      "Economic calendar",
    ],
  },
];

const socialLinks = [
  { icon: "fa-brands fa-x-twitter", href: "https://x.com/zerodha" },
  {
    icon: "fa-brands fa-facebook",
    href: "https://facebook.com/zerodha.social",
  },
  {
    icon: "fa-brands fa-instagram",
    href: "https://instagram.com/zerodhaonline/",
  },
  {
    icon: "fa-brands fa-linkedin",
    href: "https://linkedin.com/company/zerodha",
  },
  {
    icon: "fa-brands fa-youtube",
    href: "https://www.youtube.com/@zerodhaonline",
  },
  {
    icon: "fa-brands fa-whatsapp",
    href: "https://whatsapp.com/channel/0029Va8tzF0EquiIIb9j791g",
  },
  { icon: "fa-brands fa-telegram", href: "https://t.me/zerodhain" },
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
          <div className="col">
            <img
              src="media/images/logo.svg"
              className="app-footer-logo"
              alt="Zerodha logo"
            />
            <p>&copy; 2010 - 2026, Zerodha Broking Ltd. All rights reserved.</p>
            <div className="mt-3">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="me-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div className="col" key={column.heading}>
              <p className="fw-bold">{column.heading}</p>
              {column.links.map((linkText) => (
                <React.Fragment key={`${column.heading}-${linkText}`}>
                  <a href="#">{linkText}</a>
                  <br />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-5 text-muted app-footnote-text">
          {legalParagraphs.map((paragraph, index) => (
            <p key={`legal-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
