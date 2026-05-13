const express = require("express");
const ordersController = require("../controllers/ordersController");

const router = express.Router();

router.get("/allOrders", ordersController.getAllOrders);
router.post("/newOrder", ordersController.createOrder);

module.exports = router;
