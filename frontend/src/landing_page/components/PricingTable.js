import React from "react";

function PricingTable({ title, headers, rows, footnote }) {
  return (
    <div className="mt-5 mb-5 app-pricing-section">
      <h2 className="mb-4 app-pricing-heading">{title}</h2>
      <div className="table-responsive">
        <table className="table table-bordered app-pricing-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote && (
        <p className="text-muted app-pricing-footnote app-footnote-text">
          {footnote}
        </p>
      )}
    </div>
  );
}

export default PricingTable;
