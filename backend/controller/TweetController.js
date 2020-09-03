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
const publisher = redisClient.duplicate();

router.get('/tweet', JWTService.requireJWT(), async (req, res) => {
  redisClient.get('record_index', async (err, redisIndex) => {
    if (err) {
      console.log('Error', err);
      res.status(500).json({msg: err.message});
    }
    let recordIndex;
    if(!redisIndex) {
      recordIndex = 1;
      redisClient.set('start_index', recordIndex, async (err, reply) => {
        redisClient.set('record_index', (recordIndex + 1), async (err2, reply2) => {
          try {
            const nextTweet = await TweetRepository.getNextTweet(recordIndex);
            res.status(200).json({tweet: nextTweet});
          } catch (err) {
            res.status(500).json({msg: err.message});
          }
        });
      });
    } else {
      recordIndex = parseInt(redisIndex);
      redisClient.get('start_index', async (err, startIndex) => {
        if (err) {
          console.log('Error', err);
          res.status(500).json({msg: err.message});
        }
        let start = parseInt(startIndex);
        if (recordIndex - start === keys.setSize) {
          redisClient.set('start_index', recordIndex, async (err1, reply1) => {
            redisClient.set('record_index', (recordIndex + 1), async (err2, reply2) => {
              try {
                //save indices to table
                publisher.publish('learner', 'update');
                const nextTweet = await TweetRepository.getNextTweet(recordIndex);
                res.status(200).json({tweet: nextTweet});
              } catch (err) {
                res.status(500).json({msg: err.message});
              }
            });
          });
        } else {
          redisClient.set('record_index', (recordIndex + 1), async (err1, reply1) => {
            try {
              const nextTweet = await TweetRepository.getNextTweet(recordIndex);
              res.status(200).json({tweet: nextTweet});
            } catch (err) {
              res.status(500).json({msg: err.message});
            }
          });
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