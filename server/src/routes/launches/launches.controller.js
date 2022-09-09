const { getAllLaunches, addNewLaunch, existsLaunchWithId, deleteLaunchById } = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query)
  return res.status(200).json(await getAllLaunches(skip, limit))
}

async function httpCreateLaunch(req, res) {
  const launch = req.body
  if( !launch.mission || !launch.rocket || !launch.launchDate || !launch.target) return res.status(400).json({error: "Missing required fields"})

  launch.launchDate = new Date(launch.launchDate);
  if( isNaN(launch.launchDate) ) return res.status(400).json({error: "Invalid launch date"})
  await addNewLaunch(launch)

  return res.status(201).json(launch)
}

async function httpDeleteLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existsLaunch = await existsLaunchWithId(launchId)

  if(!existsLaunch) return res.status(404).json({error: "Launch does not exist"})

  const deleted = await deleteLaunchById(launchId)
  if(!deleted) return res.status(400).json({error: "Launch not deleted"})
  return res.status(200).json({ok: true})
  }

module.exports = {
  httpGetAllLaunches,
  httpCreateLaunch,
  httpDeleteLaunch
}