const TweetController = require('./TweetController');

const express = require('express');
const router = express.Router();

router.use('/tweets', TweetController);

module.exports = router;