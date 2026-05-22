import React from "react";

function PageHero({ imageURL, imageAlt, title, subtitle, className, children }) {
  return (
    <section className={`container app-hero${className ? ` ${className}` : ""}`}>
      <div className="row">
        <div className="col-12 text-center">
          {imageURL && (
            <img src={imageURL} alt={imageAlt || title} className="app-hero-image" />
          )}
          <h1 className="app-hero-title">{title}</h1>
          {subtitle && <p className="app-hero-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export default PageHero;
