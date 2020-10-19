const TextController = require('./TextController');
const UserController = require('./UserController');
const AuthController = require('./AuthController');
const MonitorController = require('./MonitorController');
const constants = require('../constants')

const express = require('express');
const router = express.Router();

router.use(constants.routeTexts, TextController);
router.use(constants.routeUsers, UserController);
router.use(constants.routeLogin, AuthController);
router.use(constants.routeMonitor, MonitorController);

module.exports = router;