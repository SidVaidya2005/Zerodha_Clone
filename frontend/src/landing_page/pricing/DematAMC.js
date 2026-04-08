import React from "react";
import PricingTable from "../components/PricingTable";

const headers = ["Value of holdings", "AMC"];

const rows = [
  ["Up to ₹4 lakh", <span className="badge bg-success">FREE*</span>],
  ["₹4 lakh - ₹10 lakh", "₹ 100 per year, charged quarterly*"],
  ["Above ₹10 lakh", "₹ 300 per year, charged quarterly"],
];

const footnote = (
  <>
    * Lower AMC is applicable only if the account qualifies as a Basic Services
    Demat Account (BSDA). BSDA account holders cannot hold more than one demat
    account. To learn more about BSDA,{" "}
    <a
      href="https://zerodha.com/charges/"
      className="text-decoration-none app-pricing-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      click here
    </a>
    .
  </>
);

function DematAMC() {
  return (
    <PricingTable
      title="Demat AMC (Annual Maintenance Charge)"
      headers={headers}
      rows={rows}
      footnote={footnote}
    />
  );
}

export default DematAMC;
