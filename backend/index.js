require("dotenv").config();

const mongoose = require("mongoose");
const buildApp = require("./app");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected!");
    const app = buildApp();
    app.listen(PORT, () => {
      console.log("App started on port", PORT);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
