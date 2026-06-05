const crypto = require("node:crypto");
const userService = require("../services/userService");
const googleAuthService = require("../services/googleAuthService");
const { signToken } = require("../services/authService");

const COOKIE_NAME = "auth";
const STATE_COOKIE = "oauth_state";

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
}

function publicUser(user) {
  return { id: user._id.toString(), fullName: user.fullName, email: user.email };
}

// Server-controlled redirect targets only — never reflect a request param into
// the Location header (open-redirect prevention).
function frontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:3000";
}

function dashboardUrl() {
  return process.env.DASHBOARD_URL || "http://localhost:3004";
}

function googleStart(req, res) {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    res.cookie(STATE_COOKIE, state, stateCookieOptions());
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
      res.clearCookie(STATE_COOKIE, baseCookieOptions());
      return res.redirect(`${frontendUrl()}/login?error=oauth`);
    }

    // CSRF: the state echoed back by Google must match the one we stored.
    const cookieState = req.cookies && req.cookies[STATE_COOKIE];
    if (!state || !cookieState || state !== cookieState) {
      res.clearCookie(STATE_COOKIE, baseCookieOptions());
      return res.redirect(`${frontendUrl()}/login?error=state`);
    }

    // Single-use: clear the state cookie before exchanging the code.
    res.clearCookie(STATE_COOKIE, baseCookieOptions());
    if (!code) return res.redirect(`${frontendUrl()}/login?error=oauth`);

    const profile = await googleAuthService.exchangeCodeForProfile(code);
    const user = await userService.findOrCreateGoogleUser(profile);

    setAuthCookie(res, user);
    res.redirect(dashboardUrl());
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    res.clearCookie(STATE_COOKIE, baseCookieOptions());
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
