import React from "react";
import { Link } from "react-router-dom";

const suggestedLinks = [
  { to: "/about", label: "About" },
  { to: "/product", label: "Products" },
  { to: "/pricing", label: "Pricing" },
  { to: "/support", label: "Support" },
];

function NotFound() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5">404 Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <div className="mt-3 mb-4">
          <Link to="/" className="btn btn-primary px-4">
            Go Home
          </Link>
        </div>
        <p className="text-muted mb-2">You can also explore:</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          {suggestedLinks.map((linkItem) => (
            <Link
              key={linkItem.to}
              to={linkItem.to}
              className="text-decoration-none"
            >
              {linkItem.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotFound;
