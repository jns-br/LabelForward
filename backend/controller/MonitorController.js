const express = require('express');
const router = express.Router();
const MonitorRepository = require('../repositories/MonitorRepository');
const JWTService = require('../services/JWTService');

router.get('/classifiers', async (req, res) => {
  try {
    const clfData = await MonitorRepository.getClfData();
    res.status(200).json({clfData: clfData});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get('/label', async (req, res) => {
  try {
    const labelShare = await MonitorRepository.getLabelShare();
    res.status(200).json({labelShare: labelShare});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;