const TextController = require('./TextController');
const UserController = require('./UserController');
const AuthController = require('./AuthController');

const express = require('express');
const router = express.Router();

router.use('/texts', TextController);
router.use('/users', UserController);
router.use('/login', AuthController);

module.exports = router;