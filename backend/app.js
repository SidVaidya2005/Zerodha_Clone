const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

function buildCorsOptions() {
  const origins = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL].filter(Boolean);
  // Credentials require an explicit origin allowlist — wildcard is not allowed
  // by browsers when cookies are involved. Empty allowlist falls through to
  // localhost defaults so dev works without env vars.
  const allowlist = origins.length ? origins : ["http://localhost:3000", "http://localhost:3004"];
  return { origin: allowlist, credentials: true };
}

function buildApp() {
  const app = express();

  app.use(cors(buildCorsOptions()));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(require("./routes/holdings"));
  app.use(require("./routes/positions"));
  app.use(require("./routes/orders"));
  app.use(require("./routes/auth"));

  return app;
}

module.exports = buildApp;
