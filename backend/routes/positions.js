const express = require("express");
const positionsController = require("../controllers/positionsController");

const router = express.Router();

router.get("/allPositions", positionsController.getAllPositions);

module.exports = router;
