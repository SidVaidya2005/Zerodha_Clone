const crypto = require("node:crypto");
const userService = require("../services/userService");
const googleAuthService = require("../services/googleAuthService");
const { signToken } = require("../services/authService");

const COOKIE_NAME = "auth";
const STATE_COOKIE = "oauth_state";
const NONCE_COOKIE = "oauth_nonce";

// The handoff nonce binds the issued session to the browser that started login
// (the dashboard generates it and keeps a copy in its own sessionStorage). We
// round-trip it through these cookies and echo it back in the redirect fragment
// so the dashboard can refuse a token it didn't ask for (login-CSRF defense).
function isValidNonce(nonce) {
  return typeof nonce === "string" && /^[A-Za-z0-9_-]{8,128}$/.test(nonce);
}

function clearOauthCookies(res) {
  res.clearCookie(STATE_COOKIE, baseCookieOptions());
  res.clearCookie(NONCE_COOKIE, baseCookieOptions());
}

function baseCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };
}

function setCookieOptions() {
  return { ...baseCookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 };
}

function stateCookieOptions() {
  // Short window covering the human consent round-trip. Inherits secure/sameSite
  // from baseCookieOptions so the state cookie comes back on Google's callback
  // (sameSite=lax allows top-level GET navigations; prod needs none+secure/HTTPS).
  return { ...baseCookieOptions(), maxAge: 10 * 60 * 1000 };
}

function setAuthCookie(res, user) {
  const token = signToken({ sub: user._id.toString(), name: user.fullName });
  res.cookie(COOKIE_NAME, token, setCookieOptions());
  return token;
}

function publicUser(user) {
  return { id: user._id.toString(), fullName: user.fullName, email: user.email };
}

// Server-controlled redirect targets only — never reflect a request param into
// the Location header (open-redirect prevention).
function frontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
}

function dashboardUrl() {
  return (process.env.DASHBOARD_URL || "http://localhost:3004").replace(/\/$/, "");
}

function googleStart(req, res) {
  try {
    // Login must be initiated from the dashboard so it can bind the session to a
    // one-time nonce it stores in its own sessionStorage. If we got here without
    // a valid nonce (e.g. a direct hit or an old bookmark), bounce to the
    // dashboard to mint one; it will come back here with `?nonce=`.
    const nonce = req.query.nonce;
    if (!isValidNonce(nonce)) {
      return res.redirect(`${dashboardUrl()}/?login=start`);
    }

    const state = crypto.randomBytes(16).toString("hex");
    res.cookie(STATE_COOKIE, state, stateCookieOptions());
    res.cookie(NONCE_COOKIE, nonce, stateCookieOptions());
    res.redirect(googleAuthService.getAuthUrl(state));
  } catch (error) {
    console.error("Google OAuth start failed", error);
    res.redirect(`${frontendUrl()}/login?error=oauth`);
  }
}

async function googleCallback(req, res) {
  try {
    const { code, state, error: oauthError } = req.query;

    // User denied consent at Google, or Google reported an error.
    if (oauthError) {
      clearOauthCookies(res);
      return res.redirect(`${frontendUrl()}/login?error=oauth`);
    }

    // CSRF: the state echoed back by Google must match the one we stored.
    const cookieState = req.cookies && req.cookies[STATE_COOKIE];
    const cookieNonce = req.cookies && req.cookies[NONCE_COOKIE];
    if (!state || !cookieState || state !== cookieState) {
      clearOauthCookies(res);
      return res.redirect(`${frontendUrl()}/login?error=state`);
    }

    // Single-use: clear the transient cookies before exchanging the code.
    clearOauthCookies(res);
    if (!code) return res.redirect(`${frontendUrl()}/login?error=oauth`);

    // Fail closed if the handoff nonce is gone — a login that didn't originate
    // from the dashboard's mint step can't be safely bound, so reject it.
    if (!isValidNonce(cookieNonce)) {
      return res.redirect(`${frontendUrl()}/login?error=state`);
    }

    const profile = await googleAuthService.exchangeCodeForProfile(code);
    const user = await userService.findOrCreateGoogleUser(profile);

    const token = setAuthCookie(res, user);
    // Hand the token to the dashboard in the URL fragment (never sent to a
    // server, so it can't leak to logs/Referer). The cookie above is a
    // third-party cookie in prod that the browser won't send on the dashboard's
    // /me call, so the dashboard stores this token and replays it as a Bearer
    // header. The nonce lets the dashboard confirm it started this login.
    res.redirect(`${dashboardUrl()}/#token=${token}&nonce=${cookieNonce}`);
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    clearOauthCookies(res);
    res.redirect(`${frontendUrl()}/login?error=oauth`);
  }
}

async function me(req, res) {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    res.json(publicUser(user));
  } catch (error) {
    console.error("Failed to load /me", error);
    res.status(500).json({ error: "Failed to load user" });
  }
}

function logout(req, res) {
  res.clearCookie(COOKIE_NAME, baseCookieOptions());
  res.status(204).end();
}

module.exports = { googleStart, googleCallback, me, logout };
