require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const rateLimit = require("express-rate-limit");

const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const newOrderLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 /newOrder requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    console.error("Failed to fetch holdings", error);
    res.status(500).send("Failed to fetch holdings");
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    console.error("Failed to fetch positions", error);
    res.status(500).send("Failed to fetch positions");
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (error) {
    console.error("Failed to fetch orders", error);
    res.status(500).send("Failed to fetch orders");
  }
});

app.post("/newOrder", newOrderLimiter, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (typeof name !== "string") {
      return res.status(400).send("Invalid name");
    }
    const safeName = name.trim();
    const numQty = Number(qty);
    const numPrice = Number(price);


    const newOrder = new OrdersModel({ name: safeName, qty: numQty, price: numPrice, mode });
    await newOrder.save();

    if (mode === "BUY") {

      const existing = await HoldingsModel.findOne({ name: safeName });
      if (existing) {
        const totalQty = existing.qty + numQty;
        const newAvg = ((existing.avg * existing.qty) + (numPrice * numQty)) / totalQty;
        await HoldingsModel.updateOne(
          { name: safeName },
          { qty: totalQty, avg: parseFloat(newAvg.toFixed(2)), price: numPrice || existing.price }
        );
      } else {
        await HoldingsModel.create({
          name: safeName,
          qty: numQty,
          avg: numPrice,
          price: numPrice,
          net: "0.00%",
          day: "0.00%",
        });
      }
    } else if (mode === "SELL") {

      const existingPos = await PositionsModel.findOne({ name: safeName });
      if (existingPos) {
        await PositionsModel.updateOne(
          { name: safeName },
          { qty: existingPos.qty + numQty, price: numPrice || existingPos.price }
        );
      } else {
        await PositionsModel.create({
          product: "CNC",
          name: safeName,
          qty: numQty,
          avg: numPrice,
          price: numPrice,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });
      }


      const holding = await HoldingsModel.findOne({ name: safeName });
      if (holding) {
        const remainingQty = holding.qty - numQty;
        if (remainingQty <= 0) {
          await HoldingsModel.deleteOne({ name: safeName });
        } else {
          await HoldingsModel.updateOne({ name: safeName }, { qty: remainingQty });
        }
      }
    }

    res.send("Order saved!");
  } catch (error) {
    console.error("Failed to save order", error);
    res.status(500).send("Failed to save order");
  }
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});
