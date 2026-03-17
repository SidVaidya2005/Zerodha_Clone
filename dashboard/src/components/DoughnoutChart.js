import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data }) {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 10,
          font: { size: 11 },
        },
      },
    },
  };

  const hasData = data?.datasets?.[0]?.data?.some((v) => v > 0);

  return (
    <div className="doughnut-chart-wrap">
      {hasData ? (
        <Doughnut data={data} options={options} />
      ) : (
        <div className="doughnut-loading">
          Loading price data...
        </div>
      )}
    </div>
  );
}
