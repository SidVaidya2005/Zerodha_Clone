import React from "react";

function ValueAddedServices() {
  return (
    <div className="mt-5 mb-5 app-pricing-section">
      <h2 className="mb-4 app-pricing-heading">
        Charges for optional value added services
      </h2>
      <div className="table-responsive">
        <table className="table table-bordered app-pricing-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Billing Frequency</th>
              <th>Charges</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tickertape</td>
              <td>Monthly / Annual</td>
              <td>Free: 0 | Pro: 249/2399</td>
            </tr>
            <tr>
              <td>Smallcase</td>
              <td>Per transaction</td>
              <td>Buy &amp; Invest More: 100 | SIP: 10</td>
            </tr>
            <tr>
              <td>Kite Connect</td>
              <td>Monthly</td>
              <td>Connect: 500 | Personal: Free</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ValueAddedServices;
