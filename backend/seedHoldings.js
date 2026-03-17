require("dotenv").config();

const mongoose = require("mongoose");
const { HoldingsModel } = require("./model/HoldingsModel");

const holdingsData = [
  {
    name: "RELIANCE",
    qty: 12,
    avg: 2410.5,
    price: 2478.2,
    net: "+2.81%",
    day: "+0.74%",
  },
  {
    name: "TCS",
    qty: 8,
    avg: 3622.1,
    price: 3585.4,
    net: "-1.01%",
    day: "-0.38%",
  },
  {
    name: "INFY",
    qty: 20,
    avg: 1490.0,
    price: 1525.6,
    net: "+2.39%",
    day: "+0.92%",
  },
  {
    name: "HDFCBANK",
    qty: 15,
    avg: 1651.2,
    price: 1689.8,
    net: "+2.34%",
    day: "+0.27%",
  },
  {
    name: "ICICIBANK",
    qty: 14,
    avg: 1040.5,
    price: 1098.1,
    net: "+5.54%",
    day: "+1.11%",
  },
  {
    name: "SBIN",
    qty: 30,
    avg: 733.0,
    price: 721.3,
    net: "-1.60%",
    day: "-0.48%",
  },
  {
    name: "ITC",
    qty: 40,
    avg: 436.5,
    price: 451.0,
    net: "+3.32%",
    day: "+0.35%",
  },
  {
    name: "AXISBANK",
    qty: 16,
    avg: 1095.6,
    price: 1124.3,
    net: "+2.62%",
    day: "+0.59%",
  },
  {
    name: "KOTAKBANK",
    qty: 10,
    avg: 1783.4,
    price: 1755.2,
    net: "-1.58%",
    day: "-0.64%",
  },
  {
    name: "LT",
    qty: 7,
    avg: 3420.0,
    price: 3518.6,
    net: "+2.88%",
    day: "+0.49%",
  },
  {
    name: "HCLTECH",
    qty: 13,
    avg: 1418.0,
    price: 1464.2,
    net: "+3.26%",
    day: "+0.83%",
  },
  {
    name: "MARUTI",
    qty: 4,
    avg: 10950.0,
    price: 11280.0,
    net: "+3.01%",
    day: "+0.67%",
  },
  {
    name: "BAJFINANCE",
    qty: 6,
    avg: 6820.4,
    price: 6711.8,
    net: "-1.59%",
    day: "-0.42%",
  },
  {
    name: "ASIANPAINT",
    qty: 9,
    avg: 2985.0,
    price: 3044.7,
    net: "+2.00%",
    day: "+0.29%",
  },
  {
    name: "TITAN",
    qty: 11,
    avg: 3465.5,
    price: 3402.1,
    net: "-1.83%",
    day: "-0.57%",
  },
  {
    name: "ULTRACEMCO",
    qty: 3,
    avg: 10090.0,
    price: 10305.4,
    net: "+2.13%",
    day: "+0.31%",
  },
  {
    name: "SUNPHARMA",
    qty: 18,
    avg: 1528.2,
    price: 1572.0,
    net: "+2.87%",
    day: "+0.52%",
  },
  {
    name: "ADANIENT",
    qty: 5,
    avg: 2892.0,
    price: 2774.5,
    net: "-4.06%",
    day: "-1.22%",
  },
  {
    name: "WIPRO",
    qty: 32,
    avg: 523.4,
    price: 541.7,
    net: "+3.50%",
    day: "+0.95%",
  },
  {
    name: "NTPC",
    qty: 24,
    avg: 338.0,
    price: 352.8,
    net: "+4.38%",
    day: "+0.44%",
  },
];

async function seedHoldings() {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    console.error("MONGO_URL is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);

    await HoldingsModel.deleteMany({});
    await HoldingsModel.insertMany(holdingsData);

    console.log(`Seeded ${holdingsData.length} holdings successfully.`);
  } catch (error) {
    console.error("Failed to seed holdings", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedHoldings();
