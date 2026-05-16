const request = require("supertest");
const buildApp = require("../app");
const { HoldingsModel } = require("../model/HoldingsModel");

const app = buildApp();

describe("GET /allHoldings", () => {
  it("returns 200 + empty array when no holdings exist", async () => {
    const res = await request(app).get("/allHoldings");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it("returns inserted holdings", async () => {
    await HoldingsModel.create({
      name: "TCS",
      qty: 10,
      avg: 3500,
      price: 3700,
      net: "+5.71%",
      day: "+0.50%",
    });

    const res = await request(app).get("/allHoldings");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ name: "TCS", qty: 10, avg: 3500 });
  });
});
