const express = require('express');
const { httpGetAllLaunches, httpCreateLaunch, httpDeleteLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpCreateLaunch)
launchesRouter.delete('/:id', httpDeleteLaunch)

module.exports = launchesRouter