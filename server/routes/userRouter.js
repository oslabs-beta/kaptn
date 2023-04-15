const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Handle POST request to create new user
router.post('/createuser', userController.createUser, (req, res) => {
  res.status(200).json('User Created');
});

// Handle POST request to verify user on login
router.post('/login', userController.verifyUser, (req, res) => {
  res.status(200).json('Login Successful');
});

module.exports = router;
