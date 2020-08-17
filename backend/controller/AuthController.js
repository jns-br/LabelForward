const express = require('express');
const JWTService = require('../services/JWTService');
const { ExtractJwt } = require('passport-jwt');

const router = express.Router();

router.post('/', JWTService.requireCredentials(), async (req, res) => {
  try {
    const token = await JWTService.signToken(req.user);
    return res.status(200).json({token});
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;