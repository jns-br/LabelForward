const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const TweetRepository = require('../repositories/TweetRepository');

router.get('/tweet', async (req, res) => {
  try {
    const nextTweet = await TweetRepository.getNextTweet();
    res.status(200).json({tweet: nextTweet});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get('/labels', async (req, res) => {
  try {
    const labels = await TweetRepository.getLabels();
    res.status(200).json({labels: labels});
  } catch (error) {
    res.status(500).json({msg: err.message});
  }
});

router.post('/tweet', async (req, res) => {
  try {
    const label = req.body.label;
    const tweet = req.body.tweet;
    await TweetRepository.insertLabeledTweet(tweet, label);
    res.status(201);
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;