import React from "react";
import PricingTable from "../components/PricingTable";

const headers = ["Type of account", "Charges"];

const rows = [
  ["Online account", <span className="badge bg-success">FREE</span>],
  ["Offline account", <span className="badge bg-success">FREE</span>],
  ["NRI account (offline only)", "₹ 500"],
  ["Partnership, LLP, HUF, or Corporate accounts (offline only)", "₹ 500"],
];

function AccountOpeningCharges() {
  return (
    <PricingTable
      title="Charges for account opening"
      headers={headers}
      rows={rows}
    />
  );
}

export default AccountOpeningCharges;
