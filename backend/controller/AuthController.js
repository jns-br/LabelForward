const express = require('express');
const JWTService = require('../services/JWTService');
const router = express.Router();

router.post('/', JWTService.requireCredentials(), async (req, res) => {
  try {
    const token = await JWTService.signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({success : true});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.get('/', JWTService.requireJWT(), async (req,res) => {
  try {
    res.status(200).json();
  } catch (err) {
    res.status(403).json();
  }
});

router.get('/logout', JWTService.requireJWT(), async (req, res) => {
  try {
    res.clearCookie('access_token');
    res.json();
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;