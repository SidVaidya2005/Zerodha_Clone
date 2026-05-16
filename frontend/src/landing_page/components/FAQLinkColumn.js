import React from "react";
import { Link } from "react-router-dom";

function FAQLinkColumn({ section, isOpen, onToggle }) {
  return (
    <div className="accordion-item mb-3">
      <div className="accordion-header" onClick={onToggle} role="button" tabIndex={0}>
        <div className="accordion-title">
          <i className={`fa ${section.icon} accordion-icon`} aria-hidden="true"></i>
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
            <Link to="/support" key={index} className="accordion-link">
              {link}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default FAQLinkColumn;
