import React from "react";
import PricingTable from "../components/PricingTable";

const headers = ["Service", "Billing Frequency", "Charges"];

const rows = [
  ["Tickertape", "Monthly / Annual", "Free: 0 | Pro: 249/2399"],
  ["Smallcase", "Per transaction", "Buy & Invest More: 100 | SIP: 10"],
  ["Kite Connect", "Monthly", "Connect: 500 | Personal: Free"],
];

function ValueAddedServices() {
  return (
    <PricingTable
      title="Charges for optional value added services"
      headers={headers}
      rows={rows}
    />
  );
}

export default ValueAddedServices;
