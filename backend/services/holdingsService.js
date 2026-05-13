const { HoldingsModel } = require("../model/HoldingsModel");

async function listHoldings() {
  return HoldingsModel.find({});
}

module.exports = { listHoldings };
