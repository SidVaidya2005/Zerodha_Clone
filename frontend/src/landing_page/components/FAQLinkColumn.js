import React from "react";
import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";

function FAQLinkColumn({ section, isOpen, onToggle }) {
  const SectionIcon = section.Icon;
  const ToggleIcon = isOpen ? ChevronUp : ChevronDown;

  return (
    <div className="accordion-item mb-3">
      <div className="accordion-header" onClick={onToggle} role="button" tabIndex={0}>
        <div className="accordion-title">
          <SectionIcon className="accordion-icon" size={18} aria-hidden="true" />
          <span>{section.title}</span>
        </div>
        <ToggleIcon className="accordion-toggle" size={18} aria-hidden="true" />
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
