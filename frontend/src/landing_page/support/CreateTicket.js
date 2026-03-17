import React, { useState } from "react";

const accountOpeningLinks = [
  "Getting started",
  "Online",
  "Offline",
  "Charges",
  "Company, Partnership and HUF",
  "Non Resident Indian (NRI)",
];

const yourZerodhaAccountLinks = [
  "Login credentials",
  "Your Profile",
  "Account modification and segment addition",
  "CMR & DP ID",
  "Nomination",
  "Transfer and conversion of shares",
];

const kiteLinks = [
  "Kite features",
  "Orders",
  "Funds",
  "Holdings and Positions",
  "Dashboard",
  "Kite app",
];

const fundsLinks = [
  "Fund withdrawal",
  "Adding funds",
  "Adding bank accounts",
  "eMandates",
];

const consoleLinks = [
  "IPO",
  "Portfolio",
  "Funds statement",
  "Profile",
  "Reports",
  "Referral program",
];

const coinLinks = [
  "Understanding mutual funds and Coin",
  "Coin app",
  "Coin web",
  "Transactions and reports",
  "National Pension Scheme (NPS)",
];

const quickLinks = [
  "Track account opening",
  "Track segment activation",
  "Intraday margins",
  "Kite user manual",
  "Learn how to create a ticket",
];

const featuredLinks = [
  "MCX - Revision in Trading Hours from March 09, 2026",
  "Exchange issue with order placement on NSE [Resolved]",
];

const ticketSections = [
  {
    id: 1,
    title: "Account Opening",
    links: accountOpeningLinks,
    icon: "fa-plus-circle",
  },
  {
    id: 2,
    title: "Your Zerodha Account",
    links: yourZerodhaAccountLinks,
    icon: "fa-user",
  },
  { id: 3, title: "Kite", links: kiteLinks, icon: "fa-smile-o" },
  { id: 4, title: "Funds", links: fundsLinks, icon: "fa-info-circle" },
  { id: 5, title: "Console", links: consoleLinks, icon: "fa-dot-circle-o" },
  { id: 6, title: "Coin", links: coinLinks, icon: "fa-circle-o" },
];

function AccordionItem({ section, isOpen, onToggle }) {
  return (
    <div className="accordion-item mb-3">
      <div
        className="accordion-header"
        onClick={onToggle}
        role="button"
        tabIndex={0}
      >
        <div className="accordion-title">
          <i
            className={`fa ${section.icon} accordion-icon`}
            aria-hidden="true"
          ></i>
          <span>{section.title}</span>
        </div>
        <i
          className={`fa fa-chevron-${isOpen ? "up" : "down"} accordion-toggle`}
          aria-hidden="true"
        ></i>
      </div>
      {isOpen && (
        <div className="accordion-content">
          {section.links.map((link, index) => (
            <a href="" key={index} className="accordion-link">
              {link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateTicket() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="container support-main-container">
      <div className="row">
        <div className="col-lg-8 col-md-12 mb-5">
          <div className="accordion-wrapper">
            {ticketSections.map((section) => (
              <AccordionItem
                key={section.id}
                section={section}
                isOpen={openSection === section.id}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="featured-box mb-4">
            <ul className="featured-list">
              {featuredLinks.map((link, index) => (
                <li key={index}>
                  <a href="" className="featured-link">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="quick-links-box">
            <h5 className="quick-links-title">Quick links</h5>
            <ol className="quick-links-list">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="" className="quick-link">
                    {link}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
