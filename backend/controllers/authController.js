const userService = require("../services/userService");
const { hashPassword, verifyPassword, signToken } = require("../services/authService");

const COOKIE_NAME = "auth";

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

function setAuthCookie(res, user) {
  const token = signToken({ sub: user._id.toString(), name: user.fullName });
  res.cookie(COOKIE_NAME, token, setCookieOptions());
}

function publicUser(user) {
  return { id: user._id.toString(), fullName: user.fullName, email: user.email };
}

async function signup(req, res) {
  try {
    const { fullName, email, phoneNumber, password } = req.body || {};
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await userService.findByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await hashPassword(password);
    const user = await userService.createUser({ fullName, email, phoneNumber, passwordHash });

    setAuthCookie(res, user);
    res.status(201).json(publicUser(user));
  } catch (error) {
    console.error("Signup failed", error);
    res.status(500).json({ error: "Signup failed" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await userService.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, user);
    res.json(publicUser(user));
  } catch (error) {
    console.error("Login failed", error);
    res.status(500).json({ error: "Login failed" });
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

module.exports = { signup, login, me, logout };
