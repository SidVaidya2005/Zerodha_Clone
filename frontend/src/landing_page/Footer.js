import React from "react";

const footerColumns = [
  {
    heading: "Account",
    links: [
      "Open demat account",
      "Minor demat account",
      "NRI demat account",
      "Commodity",
      "Dematerialisation",
      "Fund transfer",
      "MTF",
      "Referral program",
    ],
  },
  {
    heading: "Support",
    links: [
      "Contact us",
      "Support portal",
      "How to file a complaint?",
      "Status of your complaints",
      "Bulletin",
      "Circular",
      "Downloads",
    ],
  },
  {
    heading: "Company",
    links: [
      "About",
      "Philosophy",
      "Press & media",
      "Careers",
      "Zerodha Cares (CSR)",
      "Zerodha.tech",
      "Open source",
    ],
  },
  {
    heading: "Quick links",
    links: [
      "Upcoming IPOs",
      "Brokerage charges",
      "Market holidays",
      "Economic calendar",
      "Calculators",
      "Markets",
      "Sectors",
    ],
  },
];

const socialLinks = [
  { icon: "fa-brands fa-x-twitter", href: "#" },
  { icon: "fa-brands fa-facebook", href: "#" },
  { icon: "fa-brands fa-instagram", href: "#" },
  { icon: "fa-brands fa-linkedin", href: "#" },
  { icon: "fa-brands fa-youtube", href: "#" },
  { icon: "fa-brands fa-whatsapp", href: "#" },
  { icon: "fa-brands fa-telegram", href: "#" },
];

const legalParagraphs = [
  `Zerodha Broking Ltd.: Member of NSE and BSE - SEBI Registration no.: INZ000031633 CDSL: Depository services through Zerodha Securities Pvt. Ltd. - SEBI Registration no.: IN-DP-100-2015 Commodity Trading through Zerodha Commodities Pvt. Ltd. MCX: 46025 - SEBI Registration no.: INZ000038238 Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities broking please write to complaints@zerodha.com, for DP related to dp@zerodha.com. Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF`,
  `Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances`,
  `Investments in securities market are subject to market risks; read all the related documents carefully before investing.`,
  `"Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of Zerodha and offering such services, please create a ticket here.`,
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
                <a key={social.icon} href={social.href} className="me-3">
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
