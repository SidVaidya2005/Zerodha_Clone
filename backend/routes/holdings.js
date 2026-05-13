const express = require("express");
const holdingsController = require("../controllers/holdingsController");

const router = express.Router();

router.get("/allHoldings", holdingsController.getAllHoldings);

module.exports = router;
