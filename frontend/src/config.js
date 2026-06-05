const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";

// Entry point for the server-side Google OAuth flow. The backend redirects to
// Google's consent screen, sets the httpOnly auth cookie, then redirects to the
// dashboard. Every "sign in / sign up" CTA points here.
export const GOOGLE_AUTH_URL = `${BACKEND_URL}/auth/google`;

// Personal profile links surfaced in the marketing UI (support page; the footer
// currently hardcodes the same two values and could be switched to these later).
export const GITHUB_URL = "https://github.com/SidVaidya2005";
export const PORTFOLIO_URL = "https://siddarthvaidya2005-7iyf.onrender.com";

export default BACKEND_URL;
