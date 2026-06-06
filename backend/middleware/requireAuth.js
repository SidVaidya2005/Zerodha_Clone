const { verifyToken } = require("../services/authService");

// Accept the JWT from either an `Authorization: Bearer` header or the `auth`
// cookie. The Bearer path exists because the dashboard and backend are deployed
// on separate sites in prod, where the cookie is a third-party cookie browsers
// block — so the dashboard sends the token as a header instead. Same-origin /
// localhost requests still work via the cookie.
function bearerToken(req) {
  const header = req.headers && req.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

function requireAuth(req, res, next) {
  const token = bearerToken(req) || (req.cookies && req.cookies.auth);
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
