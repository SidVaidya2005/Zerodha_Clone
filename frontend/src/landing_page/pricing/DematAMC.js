import React from "react";

function DematAMC() {
  return (
    <div className="mt-5 mb-5 app-pricing-section">
      <h2 className="mb-4 app-pricing-heading">
        Demat AMC (Annual Maintenance Charge)
      </h2>
      <div className="table-responsive">
        <table className="table table-bordered app-pricing-table">
          <thead>
            <tr>
              <th>Value of holdings</th>
              <th>AMC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Up to ₹4 lakh</td>
              <td>
                <span className="badge bg-success">FREE*</span>
              </td>
            </tr>
            <tr>
              <td>₹4 lakh - ₹10 lakh</td>
              <td>₹ 100 per year, charged quarterly*</td>
            </tr>
            <tr>
              <td>Above ₹10 lakh</td>
              <td>₹ 300 per year, charged quarterly</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted app-pricing-footnote app-footnote-text">
        * Lower AMC is applicable only if the account qualifies as a Basic
        Services Demat Account (BSDA). BSDA account holders cannot hold more
        than one demat account. To learn more about BSDA,{" "}
        <a href="" className="text-decoration-none app-pricing-link">
          click here
        </a>
        .
      </p>
    </div>
  );
}

export default DematAMC;
