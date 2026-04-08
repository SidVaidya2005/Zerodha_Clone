import React from "react";

function PageHero({ imageURL, imageAlt, title, subtitle, className, children }) {
  return (
    <div className={`container p-3 p-md-5 mb-5${className ? ` ${className}` : ""}`}>
      <div className="row text-center">
        {imageURL && (
          <img src={imageURL} alt={imageAlt || title} className="mb-5 dark-invert" />
        )}
        <h1 className="mt-5">{title}</h1>
        {subtitle && <p className="text-muted mt-3 fs-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

export default PageHero;
