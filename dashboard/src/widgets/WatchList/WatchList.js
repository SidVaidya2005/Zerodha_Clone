import React, { useState, useMemo } from "react";

import { parseNumericPrice } from "../../utils/portfolioUtils";
import { BACKGROUND_COLORS, BORDER_COLORS } from "../../data/chartPalette";
import { useWatchlistPolling } from "../../hooks/useWatchlistPolling";

import { DoughnutChart } from "../../charts/DoughnutChart";

import WatchListItem from "./WatchListItem";
import AnalyticsModal from "./AnalyticsModal";

const WatchList = () => {
  const { liveWatchlist } = useWatchlistPolling();
  const [analyticsStock, setAnalyticsStock] = useState(null);

  const data = useMemo(() => {
    const totalPrice = liveWatchlist.reduce(
      (acc, stock) => acc + parseNumericPrice(stock.price),
      0
    );

    const labels = liveWatchlist.map((stock) => {
      const price = parseNumericPrice(stock.price);
      const percentage = totalPrice > 0 ? ((price / totalPrice) * 100).toFixed(2) : 0;
      return `${stock.name}: ${percentage}%`;
    });

    const dataPoints = liveWatchlist.map((stock) => parseNumericPrice(stock.price));

    return {
      labels,
      datasets: [
        {
          label: "Price",
          data: dataPoints,
          backgroundColor: BACKGROUND_COLORS,
          borderColor: BORDER_COLORS,
          borderWidth: 1,
        },
      ],
    };
  }, [liveWatchlist]);

  return (
    <div className="watchlist-container">
      <ul className="list">
        {liveWatchlist.map((stock) => (
          <WatchListItem stock={stock} key={stock.name} onAnalyticsClick={setAnalyticsStock} />
        ))}
      </ul>

      <DoughnutChart data={data} />

      {analyticsStock && (
        <AnalyticsModal stock={analyticsStock} onClose={() => setAnalyticsStock(null)} />
      )}
    </div>
  );
};

export default WatchList;
