const request = require("supertest");
const buildApp = require("../app");
const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");

const app = buildApp();

describe("POST /newOrder — BUY", () => {
  it("creates a new holding on first BUY", async () => {
    const res = await request(app)
      .post("/newOrder")
      .send({ name: "INFY", qty: 10, price: 1500, mode: "BUY" });

    expect(res.status).toBe(200);

    const holding = await HoldingsModel.findOne({ name: "INFY" });
    expect(holding).not.toBeNull();
    expect(holding.qty).toBe(10);
    expect(holding.avg).toBe(1500);

    const order = await OrdersModel.findOne({ name: "INFY" });
    expect(order).not.toBeNull();
    expect(order.mode).toBe("BUY");
  });

  it("recomputes weighted average on subsequent BUY", async () => {
    await request(app).post("/newOrder").send({ name: "INFY", qty: 10, price: 1500, mode: "BUY" });

    await request(app).post("/newOrder").send({ name: "INFY", qty: 5, price: 2000, mode: "BUY" });

    // (1500*10 + 2000*5) / 15 = 25000/15 = 1666.666... → rounded to 1666.67
    const holding = await HoldingsModel.findOne({ name: "INFY" });
    expect(holding.qty).toBe(15);
    expect(holding.avg).toBe(1666.67);
  });
});

describe("POST /newOrder — SELL", () => {
  it("exact-qty SELL deletes the holding and creates a position", async () => {
    await HoldingsModel.create({
      name: "WIPRO",
      qty: 5,
      avg: 400,
      price: 420,
      net: "0.00%",
      day: "0.00%",
    });

    const res = await request(app)
      .post("/newOrder")
      .send({ name: "WIPRO", qty: 5, price: 420, mode: "SELL" });

    expect(res.status).toBe(200);

    const holding = await HoldingsModel.findOne({ name: "WIPRO" });
    expect(holding).toBeNull();

    const position = await PositionsModel.findOne({ name: "WIPRO" });
    expect(position).not.toBeNull();
    expect(position.qty).toBe(5);
  });

  it("partial SELL decrements the holding without deleting it", async () => {
    await HoldingsModel.create({
      name: "HCL",
      qty: 10,
      avg: 1200,
      price: 1250,
      net: "0.00%",
      day: "0.00%",
    });

    await request(app).post("/newOrder").send({ name: "HCL", qty: 3, price: 1250, mode: "SELL" });

    const holding = await HoldingsModel.findOne({ name: "HCL" });
    expect(holding).not.toBeNull();
    expect(holding.qty).toBe(7);
  });
});

describe("POST /newOrder — validation", () => {
  it("rejects a non-string name with 400", async () => {
    const res = await request(app)
      .post("/newOrder")
      .send({ name: 123, qty: 5, price: 100, mode: "BUY" });

    expect(res.status).toBe(400);
  });
});
