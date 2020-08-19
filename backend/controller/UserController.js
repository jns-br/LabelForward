const express = require('express');
const router = express.Router();
const UserRepository = require('../repositories/UserRepository');
const JWTService = require('../services/JWTService');

router.post('/signup', async (req, res) => {
  try {
    const user = await UserRepository.createUser(req.body.email, req.body.password);
    if(!user) {
      res.status(403).json({msg: "No access with this email"});
    } else {
      res.status(201).json();
    }
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.post('/email', JWTService.requireJWT(), async (req, res) => {
  try {
    const { email, newEmail, password } = req.body;
    const isUpdated = await UserRepository.updateEmail(email, newEmail, password);
    if(isUpdated) {
      res.status(200).json();
    } else {
      res.status(403).json();
    }
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;