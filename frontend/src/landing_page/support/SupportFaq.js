import React, { useState } from "react";
import FAQLinkColumn from "../components/FAQLinkColumn";
import { FAQ_GROUPS, FAQ_QUICK_LINKS, FAQ_FEATURED_NOTICES } from "../../data/faqLinks";

// Keep groups whose title matches, or that have at least one item matching the
// query in its question or answer; matching groups keep only their hits.
function filterFaqGroups(groups, query) {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups
    .map((group) => {
      if (group.title.toLowerCase().includes(q)) return group;
      const items = group.items.filter(
        (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
}

function SupportFaq({ query }) {
  const [openSection, setOpenSection] = useState(null);

  const searching = query.trim().length > 0;
  const groups = filterFaqGroups(FAQ_GROUPS, query);

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="container support-main-container">
      <div className="row">
        <div className="col-lg-8 col-md-12 mb-5">
          <div className="accordion-wrapper">
            {groups.length === 0 ? (
              <p className="text-muted">No help topics match “{query.trim()}”.</p>
            ) : (
              groups.map((section) => (
                <FAQLinkColumn
                  key={section.id}
                  section={section}
                  isOpen={searching || openSection === section.id}
                  onToggle={() => toggleSection(section.id)}
                />
              ))
            )}
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="featured-box mb-4">
            <ul className="featured-list">
              {FAQ_FEATURED_NOTICES.map((notice, index) => (
                <li key={index} className="featured-notice">
                  {notice}
                </li>
              ))}
            </ul>
          </div>
          <div className="quick-links-box">
            <h5 className="quick-links-title">Quick links</h5>
            <ol className="quick-links-list">
              {FAQ_QUICK_LINKS.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="quick-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
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

export default SupportFaq;
