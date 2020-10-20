const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const TextRepository = require('../repositories/TextRepository');
const JWTService = require('../services/JWTService');
const constants = require('../constants');

router.get(constants.routeText, JWTService.requireJWT(), async (req, res) => {
  try {
    const email = req.user.email;
    const nextText = await TextRepository.getNextText(email);
    if (!nextText) {
      res.status(204);
    } else {
      res.status(200).json({text: nextText.text_data, text_id: nextText.text_id});
    }
  } catch (error) {
   res.status(500).json({msg: err.message});
  }
});

router.get(constants.routeLabels, JWTService.requireJWT(), async (req, res) => {
  try {
    const labels = await TextRepository.getLabels();
    res.status(200).json({labels: labels});
  } catch (error) {
    res.status(500).json({msg: err.message});
  }
});

router.post(constants.routeText, JWTService.requireJWT(), async (req, res) => {
  try {
    const label = req.body.label;
    const text_id = req.body.text_id;
    const email = req.user.email;
    const available = await TextRepository.insertLabeledText(label, email, text_id);
    if (available) {
      res.status(201).json();
    } else {
      res.status(204).json();
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;