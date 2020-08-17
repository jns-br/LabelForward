const TweetController = require('./TweetController');
const UserController = require('./UserController');

const express = require('express');
const router = express.Router();

router.use('/tweets', TweetController);
router.use('/users', UserController);

module.exports = router;