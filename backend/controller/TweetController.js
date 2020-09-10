const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const TweetRepository = require('../repositories/TweetRepository');
const JWTService = require('../services/JWTService');

router.get('/tweet', JWTService.requireJWT(), async (req, res) => {
  try {
    const email = req.user.email;
    const nextTweet = await TweetRepository.getNextTweet(email);
    if (!nextTweet) {
      res.status(204);
    } else {
      res.status(200).json({tweet: nextTweet});
    }
  } catch (error) {
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
    const label = req.body.label;
    const tweet = req.body.tweet;
    await TweetRepository.insertLabeledTweet(tweet, label);
    res.status(201).json();
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;