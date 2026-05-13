const holdingsService = require("../services/holdingsService");

async function getAllHoldings(req, res) {
  try {
    const allHoldings = await holdingsService.listHoldings();
    res.json(allHoldings);
  } catch (error) {
    console.error("Failed to fetch holdings", error);
    res.status(500).send("Failed to fetch holdings");
  }
}

module.exports = { getAllHoldings };
