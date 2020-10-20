const constants = require('../constants');
const express = require('express');
const JWTService = require('../services/JWTService');
const router = express.Router();

router.post(constants.routeBase, JWTService.requireCredentials(), async (req, res) => {
  try {
    const token = await JWTService.signToken(req.user);
    res.cookie(constants.keyAccessToken, token, {
      httpOnly: true
    });
    res.status(200).json({success : true});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get(constants.routeBase, JWTService.requireJWT(), async (req,res) => {
  try {
    res.status(200).json();
  } catch (err) {
    res.status(403).json();
  }
});

router.get(constants.routeLogout, JWTService.requireJWT(), async (req, res) => {
  try {
    res.clearCookie(constants.keyAccessToken);
    res.json();
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;