import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL } from "../config";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
