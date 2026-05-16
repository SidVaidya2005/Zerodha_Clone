import React, { useState } from "react";
import { Link } from "react-router-dom";
import FAQLinkColumn from "../components/FAQLinkColumn";
import { FAQ_GROUPS, FAQ_QUICK_LINKS, FAQ_FEATURED_LINKS } from "../../data/faqLinks";

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
            {FAQ_GROUPS.map((section) => (
              <FAQLinkColumn
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
              {FAQ_FEATURED_LINKS.map((link, index) => (
                <li key={index}>
                  <Link to="/support" className="featured-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="quick-links-box">
            <h5 className="quick-links-title">Quick links</h5>
            <ol className="quick-links-list">
              {FAQ_QUICK_LINKS.map((link, index) => (
                <li key={index}>
                  <Link to="/support" className="quick-link">
                    {link}
                  </Link>
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
