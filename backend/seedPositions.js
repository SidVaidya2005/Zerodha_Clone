require("dotenv").config();

const mongoose = require("mongoose");
const { PositionsModel } = require("./model/PositionsModel");

const positionsData = [
  {
    product: "CNC",
    name: "RELIANCE",
    qty: 5,
    avg: 2442.3,
    price: 2478.2,
    net: "+1.47%",
    day: "+0.74%",
    isLoss: false,
  },
  {
    product: "MIS",
    name: "TCS",
    qty: 3,
    avg: 3610.5,
    price: 3585.4,
    net: "-0.70%",
    day: "-0.38%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "INFY",
    qty: 10,
    avg: 1502.2,
    price: 1525.6,
    net: "+1.56%",
    day: "+0.92%",
    isLoss: false,
  },
  {
    product: "NRML",
    name: "HDFCBANK",
    qty: 6,
    avg: 1661.9,
    price: 1689.8,
    net: "+1.68%",
    day: "+0.27%",
    isLoss: false,
  },
  {
    product: "MIS",
    name: "SBIN",
    qty: 12,
    avg: 729.5,
    price: 721.3,
    net: "-1.12%",
    day: "-0.48%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "ITC",
    qty: 20,
    avg: 441.4,
    price: 451.0,
    net: "+2.18%",
    day: "+0.35%",
    isLoss: false,
  },
  {
    product: "NRML",
    name: "AXISBANK",
    qty: 8,
    avg: 1102.0,
    price: 1124.3,
    net: "+2.02%",
    day: "+0.59%",
    isLoss: false,
  },
  {
    product: "MIS",
    name: "KOTAKBANK",
    qty: 4,
    avg: 1789.6,
    price: 1755.2,
    net: "-1.92%",
    day: "-0.64%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "LT",
    qty: 2,
    avg: 3472.0,
    price: 3518.6,
    net: "+1.34%",
    day: "+0.49%",
    isLoss: false,
  },
  {
    product: "NRML",
    name: "HCLTECH",
    qty: 7,
    avg: 1436.4,
    price: 1464.2,
    net: "+1.94%",
    day: "+0.83%",
    isLoss: false,
  },
];

async function seedPositions() {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    console.error("MONGO_URL is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);

    await PositionsModel.deleteMany({});
    await PositionsModel.insertMany(positionsData);

    console.log(`Seeded ${positionsData.length} positions successfully.`);
  } catch (error) {
    console.error("Failed to seed positions", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedPositions();
