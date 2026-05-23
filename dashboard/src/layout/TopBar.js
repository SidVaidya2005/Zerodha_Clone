import React from "react";

import Menu from "./Menu";
import { useIndicesPolling } from "../hooks/useIndicesPolling";

const TopBar = () => {
  const { indices } = useIndicesPolling();

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
