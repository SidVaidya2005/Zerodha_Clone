import React from "react";
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
          {section.items.map((item, index) => (
            <div className="faq-qa" key={index}>
              <p className="faq-question">{item.q}</p>
              <p className="faq-answer">{item.a}</p>
              {item.link && (
                <a
                  href={item.link.href}
                  className="faq-answer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.link.label} →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FAQLinkColumn;
