const { PositionsModel } = require("../model/PositionsModel");

async function listPositions() {
  return PositionsModel.find({});
}

module.exports = { listPositions };
