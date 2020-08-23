const express = require('express');
const redis = require('redis');
const { restart } = require('nodemon');
const router = express.Router();
const TweetRepository = require('../repositories/TweetRepository');
const JWTService = require('../services/JWTService');
const keys = require('../keys');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

router.get('/tweet', JWTService.requireJWT(), async (req, res) => {
  redisClient.get('record_index', async (err, redisIndex) => {
    if(err) {
      console.log('Error', err);
      res.status(500).json({msg: err.message});
    } else {
      let recordIndex;
      if(!redisIndex) {
        recordIndex = 1;
      } else {
        recordIndex = parseInt(redisIndex);
      }
      redisClient.set('record_index', (recordIndex + 1), async (err, reply) => {
        try {
          const nextTweet = await TweetRepository.getNextTweet(recordIndex);
          res.status(200).json({tweet: nextTweet});
        } catch (err) {
          res.status(500).json({msg: err.message});
        }
      });
    }
  });
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