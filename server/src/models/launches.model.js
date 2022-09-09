const { default: axios } = require("axios");
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const findLaunch = async (filter) => {
  return await launches.findOne(filter);
}

const existsLaunchWithId = async (launchId) => {
  return await findLaunch({flightNumber: launchId});
}

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber')

    if(!latestLaunch){
      return 100;
    }

    return latestLaunch.flightNumber;
}

const getAllLaunches = async (skip, limit) => {
  return await launches
    .find({},{'_id': 0, '__v': 0}).
    sort({ 'flightNumber': 1}) // ASC
    .skip(skip)
    .limit(limit)
}

const addNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if(!planet){
    throw new Error(`Couldn't find a planet for ${launch.target}`);
  }

  const latestFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
  })

  await saveLaunch(newLaunch)
}

const deleteLaunchById = async (launchId) => {
  const aborted = await launches.updateOne({'flightNumber': launchId,}, {
    upcoming: false,
    success: false
  })
  return aborted.modifiedCount === 1
}

async function saveLaunch(launch) {
     await launches.findOneAndUpdate({
      flightNumber: launch.flightNumber
     }, launch, {
      upsert: true,
     })
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

const populateLaunches = async () => {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
            flight_number: 1,
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          }
        }
      ]
    }
  })

  if(response.status !== 200){
    console.log("Problem downloading launch data")
    throw new Error("Launch data download failed")
  }

  response.data.docs.forEach(async doc => {
    await saveLaunch({
      flightNumber: doc.flight_number,
      mssion: doc.name,
      rocket: doc.rocket.name,
      launchDate: doc.date_local,
      customers: doc.payloads.flatMap((payload) => payload.customers),
      upcoming: doc.upcoming,
      success: doc.success,
    })
  })
}

const loadLaunchData = async() => {
  const firstLaunch = await findLaunch({flightNumber: 1, rocket: 'Falcon 1', mission: "FalconSat"})

  if (firstLaunch){
    console.log("Launch data already exists")
  } else {
    await populateLaunches()
  }


}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  deleteLaunchById,
  loadLaunchData
}