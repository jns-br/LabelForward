const express = require('express');
const router = express.Router();
const UserRepository = require('../repositories/UserRepository');
const JWTService = require('../services/JWTService');
const constants = require('../constants');

router.post(constants.routeSignUp, async (req, res) => {
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

router.post(constants.routeEmail, JWTService.requireJWT(), async (req, res) => {
  try {
    const id = req.user.user_id;
    const { newEmail, password } = req.body;
    const isUpdated = await UserRepository.updateEmail(id, newEmail, password);
    if(isUpdated) {
      res.status(200).json();
    } else {
      res.status(403).json();
    }
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

router.post(constants.routePassword, JWTService.requireJWT(), async (req, res) => {
  try {
    const id = req.user.user_id;
    const {oldPassword, newPassword} = req.body;
    const isUpdated = await UserRepository.updatePassword(id, oldPassword, newPassword);
    if(isUpdated) {
      res.status(200).json();
    } else {
      res.status(403).json();
    }
  } catch (err) {
    res.status(500).json({msg: err.msg});
  }
});

module.exports = router;