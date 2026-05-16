const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

function buildApp() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use(require("./routes/holdings"));
  app.use(require("./routes/positions"));
  app.use(require("./routes/orders"));

  return app;
}

module.exports = buildApp;
