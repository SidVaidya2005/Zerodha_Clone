import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./styles/index.css";
import Home from "./layout/Home";
import { UserProvider } from "./context/UserContext";
import { BACKEND_URL } from "./config";
import {
  captureTokenFromUrl,
  getToken,
  startLoginIfRequested,
} from "./context/authToken";

// Cookie-based auth requires every request to include credentials (used on
// localhost / same-site deploys).
axios.defaults.withCredentials = true;

// Cross-site deploys can't rely on the cookie, so we also carry the session as
// a Bearer token: attach it to backend requests only (never the price proxy).
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token && BACKEND_URL && (config.url || "").startsWith(BACKEND_URL)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// `?login=start` means we're kicking off OAuth — mint the nonce and hand off to
// the backend; don't render the app (we're navigating away). Otherwise this is
// a normal load: capture any token the callback handed back in the fragment.
if (!startLoginIfRequested()) {
  captureTokenFromUrl();

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
}
