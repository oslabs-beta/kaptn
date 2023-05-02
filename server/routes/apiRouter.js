/*
  PLEASE NOTE: This API is no longer being used and has been replaced by the Electron IPC Renderer. See /src/main.js file.
*/

const express = require('express');

const apiController = require('../controllers/apiController.js');

const router = express.Router();

router.post('/', apiController.postCommand, (req, res) => {
  return res.status(200).json(res.locals.cliResponse);
});

module.exports = router;
