const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");

async function applyBuyEffects({ name, qty, price }) {
  const existing = await HoldingsModel.findOne({ name });
  if (existing) {
    const totalQty = existing.qty + qty;
    const newAvg = (existing.avg * existing.qty + price * qty) / totalQty;
    await HoldingsModel.updateOne(
      { name },
      {
        qty: totalQty,
        avg: parseFloat(newAvg.toFixed(2)),
        price: Number.isFinite(price) ? price : existing.price,
      }
    );
  } else {
    await HoldingsModel.create({
      name,
      qty,
      avg: price,
      price,
      net: "0.00%",
      day: "0.00%",
    });
  }
}

async function applySellEffects({ name, qty, price }) {
  const [existingPos, holding] = await Promise.all([
    PositionsModel.findOne({ name }),
    HoldingsModel.findOne({ name }),
  ]);

  if (existingPos) {
    await PositionsModel.updateOne(
      { name },
      {
        qty: existingPos.qty + qty,
        price: Number.isFinite(price) ? price : existingPos.price,
      }
    );
  } else {
    await PositionsModel.create({
      product: "CNC",
      name,
      qty,
      avg: price,
      price,
      net: "0.00%",
      day: "0.00%",
      isLoss: false,
    });
  }

  if (holding) {
    const remainingQty = holding.qty - qty;
    if (remainingQty <= 0) {
      await HoldingsModel.deleteOne({ name });
    } else {
      await HoldingsModel.updateOne({ name }, { qty: remainingQty });
    }
  }
}

async function placeOrder({ name, qty, price, mode }) {
  if (mode === "BUY") {
    await applyBuyEffects({ name, qty, price });
  } else if (mode === "SELL") {
    await applySellEffects({ name, qty, price });
  }
}

module.exports = { placeOrder, applyBuyEffects, applySellEffects };
