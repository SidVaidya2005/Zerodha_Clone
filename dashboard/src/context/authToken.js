// Session token storage + login handoff for the dashboard.
//
// In prod the dashboard and backend live on separate sites, so the httpOnly
// `auth` cookie the backend sets is a third-party cookie that browsers refuse
// to send on the dashboard's XHRs. Instead, the OAuth callback redirects here
// with the JWT in the URL fragment; we stash it and send it as a Bearer header
// (see the axios interceptor in index.js). On localhost the cookie still works,
// but the Bearer path is harmless there too.
//
// Login-CSRF / session-fixation defense: a token in the fragment alone could be
// forged by anyone with a valid JWT (e.g. emailing a victim a `#token=` link),
// which would silently log the victim in as the attacker. So login is bound to
// a one-time `nonce`: we mint it here, keep it in sessionStorage (this origin,
// this tab — not readable cross-origin), round-trip it through the backend, and
// only accept the returned token if the echoed nonce matches. An attacker can't
// read or predict our sessionStorage nonce, so a forged link fails the check.
//
// Trade-off vs. the httpOnly cookie: a token in localStorage is readable by JS,
// so it's exposed to XSS. Acceptable here given the cross-site deploy; revisit
// if the apps ever share an apex domain (then the cookie alone suffices).

import { BACKEND_URL } from "../config";

const TOKEN_KEY = "auth_token";
const NONCE_KEY = "login_nonce";

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode quota, etc.) — nothing we can do.
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

function randomNonce() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Reads and removes the pending login nonce — it is strictly single-use.
function takeLoginNonce() {
  try {
    const nonce = window.sessionStorage.getItem(NONCE_KEY);
    window.sessionStorage.removeItem(NONCE_KEY);
    return nonce;
  } catch {
    return null;
  }
}

// Constant-time-ish compare. Timing isn't really a vector for a local compare,
// but it keeps the intent explicit and avoids early-exit on length.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Step 1 of login: when the user is sent here with `?login=start`, mint a nonce,
// remember it, and hand off to the backend's OAuth start with that nonce.
// Returns true if it redirected (caller should not render the app).
export function startLoginIfRequested() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("login") !== "start") return false;

  const nonce = randomNonce();
  try {
    window.sessionStorage.setItem(NONCE_KEY, nonce);
  } catch {
    // If we can't persist the nonce we can't complete login safely; continue
    // anyway — the backend round-trip will fail the match and we fail closed.
  }
  window.location.replace(`${BACKEND_URL}/auth/google?nonce=${encodeURIComponent(nonce)}`);
  return true;
}

// Step 2 of login: the callback sent us back to `#token=<jwt>&nonce=<nonce>`.
// Accept the token only if the nonce matches the one we minted. Always strip the
// fragment so a token never lingers in the URL/history, even when rejected.
export function captureTokenFromUrl() {
  const hash = window.location.hash;
  const tokenMatch = hash.match(/[#&]token=([^&]+)/);
  if (!tokenMatch) return;

  const nonceMatch = hash.match(/[#&]nonce=([^&]+)/);
  const presented = nonceMatch ? decodeURIComponent(nonceMatch[1]) : null;
  const expected = takeLoginNonce();

  const cleanUrl = window.location.pathname + window.location.search;
  window.history.replaceState({}, document.title, cleanUrl);

  if (!presented || !expected || !safeEqual(presented, expected)) {
    // Forged or stale handoff — refuse it. The auth gate will bounce to login.
    return;
  }
  setToken(decodeURIComponent(tokenMatch[1]));
}
