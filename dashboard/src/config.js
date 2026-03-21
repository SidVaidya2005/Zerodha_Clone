const trimTrailingSlash = (url) => (url ? url.replace(/\/$/, "") : "");

const isProduction = process.env.NODE_ENV === "production";

const configuredBackendUrl = process.env.REACT_APP_BACKEND_URL;
const configuredProxyUrl = process.env.REACT_APP_PROXY_URL;

// In production, avoid forcing localhost so deployments can use same-origin routing.
export const BACKEND_URL = trimTrailingSlash(
  configuredBackendUrl || (isProduction ? "" : "http://localhost:3002"),
);

// In production, avoid forcing localhost so deployments can use same-origin routing.
export const PROXY_URL = trimTrailingSlash(
  configuredProxyUrl || (isProduction ? "" : "http://localhost:3001"),
);

if (isProduction && (!configuredBackendUrl || !configuredProxyUrl)) {
  console.warn(
    "Missing REACT_APP_BACKEND_URL or REACT_APP_PROXY_URL in production. Falling back to same-origin API requests.",
  );
}
