const express = require('express');
const { restart } = require('nodemon');
const router = express.router();

router.get('/tweet', (req, res) => {
  try {
    const sampleTweet = {tweet: "This is a sample tweet from the server"};
    res.status(200).json(sampleTweet);
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get('/lables', (req, res) => {
  try {
    const sampleLables = {lables: ["some", "example", "lables", "from the server"]};
    res.status(200).json(sampleLables)
  } catch (error) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;