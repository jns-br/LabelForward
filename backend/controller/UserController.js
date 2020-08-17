const express = require('express');
const router = express.Router();
const UserRepository = require('../repositories/UserRepository');

router.get('/user', (req, res) => {
  try {
    const user = await UserRepository.findUserById(req.body.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({msg: err.message});
  }
});

module.exports = router;