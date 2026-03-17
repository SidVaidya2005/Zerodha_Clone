import React from "react";

function AccountOpeningCharges() {
  return (
    <div className="mt-5 mb-5 app-pricing-section">
      <h2 className="mb-4 app-pricing-heading">Charges for account opening</h2>
      <div className="table-responsive">
        <table className="table table-bordered app-pricing-table">
          <thead>
            <tr>
              <th>Type of account</th>
              <th>Charges</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Online account</td>
              <td>
                <span className="badge bg-success">FREE</span>
              </td>
            </tr>
            <tr>
              <td>Offline account</td>
              <td>
                <span className="badge bg-success">FREE</span>
              </td>
            </tr>
            <tr>
              <td>NRI account (offline only)</td>
              <td>₹ 500</td>
            </tr>
            <tr>
              <td>
                Partnership, LLP, HUF, or Corporate accounts (offline only)
              </td>
              <td>₹ 500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountOpeningCharges;
