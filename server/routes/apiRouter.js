const express = require('express');

const apiController = require('../controllers/apiController.js');

const router = express.Router();

router.post('/', apiController.postCommand, (req, res) => {
  return res.status(200).json(res.locals.cliResponse);
});

module.exports = router;
