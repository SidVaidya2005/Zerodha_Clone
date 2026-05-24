const { verifyToken } = require("../services/authService");

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.auth;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, fullName: payload.name };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
