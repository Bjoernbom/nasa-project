const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo');

const isHabitablePlanet = (planet) => planet['koi_disposition'] === 'CONFIRMED'
  && planet['koi_insol'] > 0.36 
  && planet['koi_insol'] < 1.1
  && planet['koi_prad'] < 1.6;

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: "#",
        columns: true
      }))
      .on('data', data => {
        // TODO: Replace create below with upsert
        if(isHabitablePlanet(data)) savePlanets(data)
      })
      .on('error', err => {
        console.log("error", err)
        reject(err)
      })
      .on('end', async () => {
        const allPlanetsLength = (await getAllplanets()).length;
        console.log(`${allPlanetsLength} habitable planets found!`);
        resolve();
      })
    });
  }

  const getAllplanets = async () => {
    return await planets.find({}, {'__v': 0, '_id': 0})
  }

  const savePlanets = async (planet) => {
    try {
      await planets.updateOne({
        keplerName: planet.kepler_name
      }, {
        keplerName: planet.kepler_name
      }, { 
        upsert: true
      });
    } catch (error) {
      console.error("Could not save planet ", error);
    }

  }

  module.exports = {
    loadPlanetsData,
    getAllplanets
  }