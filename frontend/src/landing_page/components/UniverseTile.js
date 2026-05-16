import React from "react";

function UniverseTile({ logo, description }) {
  return (
    <div className="col-4 p-3 mt-5">
      <img src={logo} alt="Partner platform" className="app-universe-logo dark-invert" />
      <p className="text-small text-muted mt-3">{description}</p>
    </div>
  );
}

export default UniverseTile;
