const express = require('express');
const router = express.Router();
const UserRepository = require('../repositories/UserRepository');

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

module.exports = router;