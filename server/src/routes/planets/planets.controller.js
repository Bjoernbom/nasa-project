const { getAllplanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  res.status(200).json(await getAllplanets());
}

module.exports = {
  httpGetAllPlanets
}