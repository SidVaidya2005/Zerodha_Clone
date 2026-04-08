import React, { useState, useEffect } from "react";

import Menu from "./Menu";
import { PROXY_URL } from "../config";
import { formatPercent } from "./portfolioUtils";

const TopBar = () => {
  const [indices, setIndices] = useState({
    nifty: { price: "22,040.70", percent: "+0.15%", isDown: false },
    sensex: { price: "72,643.43", percent: "-0.10%", isDown: true },
  });

  const formatIndexPoint = (value) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return "--";
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await fetch(`${PROXY_URL}/api/indices`);
        if (!response.ok) {
          throw new Error(`Indices API failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data?.nifty && data?.sensex) {
          setIndices({
            nifty: {
              price: formatIndexPoint(data.nifty.price),
              percent: formatPercent(data.nifty.percentChange),
              isDown: Number(data.nifty.percentChange) < 0,
            },
            sensex: {
              price: formatIndexPoint(data.sensex.price),
              percent: formatPercent(data.sensex.percentChange),
              isDown: Number(data.sensex.percentChange) < 0,
            },
          });
        }
      } catch (error) {
        console.error(`Error fetching indices:`, error);
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar-container">
      <Menu />
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{indices.nifty.price}</p>
          <p className={`percent ${indices.nifty.isDown ? "down" : "up"}`}>
            {indices.nifty.percent}
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{indices.sensex.price}</p>
          <p className={`percent ${indices.sensex.isDown ? "down" : "up"}`}>
            {indices.sensex.percent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
