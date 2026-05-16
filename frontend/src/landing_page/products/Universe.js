import React from "react";
import SignupCTAButton from "../components/SignupCTAButton";
import UniverseTile from "../components/UniverseTile";
import { UNIVERSE_ITEMS } from "../../data/universeItems";

function Universe() {
  return (
    <div className="container mt-5 app-universe-container">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        {UNIVERSE_ITEMS.map((partner, index) => (
          <UniverseTile
            key={`${partner.logo}-${index}`}
            logo={partner.logo}
            description={partner.description}
          />
        ))}
        <SignupCTAButton />
      </div>
    </div>
  );
}

export default Universe;
