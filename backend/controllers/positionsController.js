const positionsService = require("../services/positionsService");

async function getAllPositions(req, res) {
  try {
    const allPositions = await positionsService.listPositions();
    res.json(allPositions);
  } catch (error) {
    console.error("Failed to fetch positions", error);
    res.status(500).send("Failed to fetch positions");
  }
}

module.exports = { getAllPositions };
