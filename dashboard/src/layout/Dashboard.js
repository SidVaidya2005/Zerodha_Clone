import React from "react";
import { Route, Routes } from "react-router-dom";

import Funds from "../pages/Funds";
import Holdings from "../pages/Holdings";

import Orders from "../pages/Orders";
import Positions from "../pages/Positions";
import Summary from "../pages/Summary";
import WatchList from "../widgets/WatchList/WatchList";
import { BuyWindowProvider } from "../context/BuyWindowContext";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
        </Routes>
      </div>
      <BuyWindowProvider>
        <WatchList />
      </BuyWindowProvider>
    </div>
  );
};

export default Dashboard;
