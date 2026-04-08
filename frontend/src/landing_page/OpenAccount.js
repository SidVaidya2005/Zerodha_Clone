import React from "react";
import PageHero from "./components/PageHero";
import SignupCTAButton from "./components/SignupCTAButton";

function OpenAccount() {
  return (
    <PageHero title="Open a Zerodha account">
      <p>
        Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
        F&amp;O trades.
      </p>
      <SignupCTAButton />
    </PageHero>
  );
}

export default OpenAccount;
