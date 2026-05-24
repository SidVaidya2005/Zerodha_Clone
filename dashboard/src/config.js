const trimTrailingSlash = (url) => (url ? url.replace(/\/$/, "") : "");

const isProduction = process.env.NODE_ENV === "production";

const configuredBackendUrl = process.env.REACT_APP_BACKEND_URL;
const configuredProxyUrl = process.env.REACT_APP_PROXY_URL;
const configuredFrontendUrl = process.env.REACT_APP_FRONTEND_URL;

// In production, avoid forcing localhost so deployments can use same-origin routing.
export const BACKEND_URL = trimTrailingSlash(
  configuredBackendUrl || (isProduction ? "" : "http://localhost:3002")
);

// In production, avoid forcing localhost so deployments can use same-origin routing.
export const PROXY_URL = trimTrailingSlash(
  configuredProxyUrl || (isProduction ? "" : "http://localhost:3001")
);

// FRONTEND_URL is where unauthenticated users get redirected (to /login).
// No same-origin fallback — if it's missing in prod we cannot know where to
// send users, so we must require it explicitly.
export const FRONTEND_URL = trimTrailingSlash(
  configuredFrontendUrl || (isProduction ? "" : "http://localhost:3000")
);

if (isProduction && (!configuredBackendUrl || !configuredProxyUrl || !configuredFrontendUrl)) {
  console.warn(
    "Missing REACT_APP_BACKEND_URL, REACT_APP_PROXY_URL, or REACT_APP_FRONTEND_URL in production."
  );
}
