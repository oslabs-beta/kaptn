const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//create POST request to create new user, sending data to user controller
router.post(
  '/createuser',
  userController.createUser,
  (req, res) => {
    res.status(200).send('User Created');
  }
);

//create POST request to verify user on login, sending data to user controller
router.post(
  '/login',
  userController.verifyUser,
  (req, res) => {
    res.status(200).json({
      id: res.locals.id,
    });
  }
);

module.exports = router;
