import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL } from "../config";

const UserContext = createContext(null);

// Local-dev only: set REACT_APP_AUTH_BYPASS=true in dashboard/.env.local to skip
// the /me check and load the UI with a mock user (no backend required). The flag
// defaults off, so the committed auth gate is unchanged. Never set this in prod.
const AUTH_BYPASS = process.env.REACT_APP_AUTH_BYPASS === "true";
const MOCK_USER = { id: "dev", fullName: "Dev User", email: "dev@example.com" };

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(AUTH_BYPASS ? MOCK_USER : null);
  const [isLoading, setIsLoading] = useState(!AUTH_BYPASS);

  useEffect(() => {
    if (AUTH_BYPASS) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await axios.get(`${BACKEND_URL}/me`);
        if (!cancelled) setUser(res.data);
      } catch {
        // Any failure (401, network, server) is treated as "not authenticated":
        // bounce to the frontend's /login. We intentionally do not retry.
        window.location.href = `${FRONTEND_URL}/login`;
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading || !user) {
    return <div className="auth-loading">Loading…</div>;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserContext;
