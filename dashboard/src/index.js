import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./styles/index.css";
import Home from "./layout/Home";
import { UserProvider } from "./context/UserContext";

// Cookie-based auth requires every request to include credentials.
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
