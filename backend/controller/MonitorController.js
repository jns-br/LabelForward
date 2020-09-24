const express = require('express');
const router = express.Router();
const MonitorRepository = require('../repositories/MonitorRepository');
const JWTService = require('../services/JWTService');
const Redis = require('ioredis');
const keys = require('../keys');

router.get('/classifiers', JWTService.requireJWT(), async (req, res) => {
  try {
    const clfData = await MonitorRepository.getClfData();
    res.status(200).json({clfData: clfData});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get('/label', JWTService.requireJWT(), async (req, res) => {
  try {
    const labelShare = await MonitorRepository.getLabelShare();
    res.status(200).json({labelShare: labelShare});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.post('/download', JWTService.requireJWT(), async (req, res) => {
  try {
    const clfMsg = "clf-" + req.body.clfId;
    const redis = new Redis({ port: keys.redisPort, host: keys.redisHost });
    await redis.publish('dl_manager', clfMsg);
    res.status(200).json();
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get('/download', JWTService.requireJWT(), async (req, res) => {
  try {
    const clfId = req.query.clfId;
    console.log(req.query)
    const fileLocation = '/web_data/' + clfId + '/data.zip';
    res.download(fileLocation, err => console.log(err));
  } catch (err) {
    res.status(500).json({err: err.message});
  }
});

module.exports = router;