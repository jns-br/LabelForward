const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const TweetRepository = require('../repositories/TweetRepository');
const JWTService = require('../services/JWTService');

router.get('/tweet', JWTService.requireJWT(), async (req, res) => {
  try {
    const nextTweet = await TweetRepository.getNextTweet();
    res.status(200).json({tweet: nextTweet});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get('/labels', JWTService.requireJWT(), async (req, res) => {
  try {
    const labels = await TweetRepository.getLabels();
    res.status(200).json({labels: labels});
  } catch (error) {
    res.status(500).json({msg: err.message});
  }
});

router.post('/tweet', JWTService.requireJWT(), async (req, res) => {
  try {
    const labels = req.body.labels;
    const tweet = req.body.tweet;
    await TweetRepository.insertLabeledTweet(tweet, labels);
    res.status(201).json();
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;