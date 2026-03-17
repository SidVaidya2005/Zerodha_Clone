import React from "react";
import Hero from "./Hero";
import OpenAccount from "../OpenAccount";
import AccountOpeningCharges from "./AccountOpeningCharges";
import DematAMC from "./DematAMC";
import ValueAddedServices from "./ValueAddedServices";

function PricingPage() {
  return (
    <>
      <Hero />
      <OpenAccount />
      <AccountOpeningCharges />
      <DematAMC />
      <ValueAddedServices />
    </>
  );
}

export default PricingPage;
