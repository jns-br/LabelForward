const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const TweetRepository = require('../repositories/TweetRepository');
const JWTService = require('../services/JWTService');

router.get('/text', JWTService.requireJWT(), async (req, res) => {
  try {
    const email = req.user.email;
    const nextText = await TweetRepository.getNextText(email);
    if (!nextText) {
      res.status(204);
    } else {
      res.status(200).json({tweet: nextText.text_data, text_id: nextText.text_id});
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

router.post('/text', JWTService.requireJWT(), async (req, res) => {
  try {
    const label = req.body.label;
    const text_id = req.body.text_id;
    const email = req.user.email;
    isFull = await TweetRepository.insertLabeledTweet(label, email, text_id);
    if (isFull) {
      res.status(204).json();
    } else{
      res.status(201).json();
    }
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;