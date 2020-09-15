const TextController = require('./TextController');
const UserController = require('./UserController');
const AuthController = require('./AuthController');
const MonitorController = require('./MonitorController');

const express = require('express');
const router = express.Router();

router.use('/texts', TextController);
router.use('/users', UserController);
router.use('/login', AuthController);
router.use('/monitor', MonitorController);

module.exports = router;