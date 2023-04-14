const express = require('express');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/userController');
const {ipcRenderer, ipcMain} = require('electron') 

//create POST request to create new user, sending data to user controller
router.post(
  '/createuser',
  userController.createUser,
  (req, res) => {
    console.log('USER CREATED')
    res.status(200).json('User Created');
  }
);

//create POST request to verify user on login, sending data to user controller
router.post(
  '/login',
  userController.verifyUser,
  //ADD ANOTHER CONTROLLER TO LOAD PAGE
  (req, res) => {
    // console.log(res);
    console.log('IN ROUTE')
    // return res.sendStatus(200)
    // res.redirect('/dashboard')
    res.status(200).send('user router')
    // ipcRenderer.send('login-success')
  }
);

module.exports = router;
