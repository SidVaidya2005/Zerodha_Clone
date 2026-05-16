const request = require("supertest");
const buildApp = require("../app");
const { PositionsModel } = require("../model/PositionsModel");

const app = buildApp();

describe("GET /allPositions", () => {
  it("returns 200 + empty array when no positions exist", async () => {
    const res = await request(app).get("/allPositions");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it("returns inserted positions", async () => {
    await PositionsModel.create({
      product: "CNC",
      name: "RELIANCE",
      qty: 3,
      avg: 2500,
      price: 2550,
      net: "+2.00%",
      day: "+0.30%",
      isLoss: false,
    });

    const res = await request(app).get("/allPositions");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ name: "RELIANCE", qty: 3, product: "CNC" });
  });
});
