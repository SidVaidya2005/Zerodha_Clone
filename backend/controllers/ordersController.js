const { OrdersModel } = require("../model/OrdersModel");
const orderService = require("../services/orderService");

async function getAllOrders(req, res) {
  try {
    const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (error) {
    console.error("Failed to fetch orders", error);
    res.status(500).send("Failed to fetch orders");
  }
}

async function createOrder(req, res) {
  try {
    const { name, qty, price, mode } = req.body;
    if (typeof name !== "string") {
      return res.status(400).send("Invalid name");
    }
    const safeName = name.trim();
    const numQty = Number(qty);
    const numPrice = Number(price);

    const newOrder = new OrdersModel({
      name: safeName,
      qty: numQty,
      price: numPrice,
      mode,
    });
    await newOrder.save();

    await orderService.placeOrder({
      name: safeName,
      qty: numQty,
      price: numPrice,
      mode,
    });

    res.send("Order saved!");
  } catch (error) {
    console.error("Failed to save order", error);
    res.status(500).send("Failed to save order");
  }
}

module.exports = { getAllOrders, createOrder };
