require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

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

app.post("/newOrder", async (req, res) => {
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
          { qty: totalQty, avg: parseFloat(newAvg.toFixed(2)), price: Number.isFinite(numPrice) ? numPrice : existing.price }
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

      const [existingPos, holding] = await Promise.all([
        PositionsModel.findOne({ name: safeName }),
        HoldingsModel.findOne({ name: safeName }),
      ]);

      if (existingPos) {
        await PositionsModel.updateOne(
          { name: safeName },
          { qty: existingPos.qty + numQty, price: Number.isFinite(numPrice) ? numPrice : existingPos.price }
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

mongoose.connect(uri)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => {
      console.log("App started on port", PORT);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
