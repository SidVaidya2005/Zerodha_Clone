import React from "react";
import SignupCTAButton from "../components/SignupCTAButton";

function OpenAccount() {
  return (
    <section className="app-cta-band">
      <div className="app-mini-container">
        <h2 className="app-cta-heading">Open a Zerodha account</h2>
        <p className="app-cta-lead">
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&amp;O trades.
        </p>
        <SignupCTAButton />
      </div>
    </section>
  );
}

export default OpenAccount;
