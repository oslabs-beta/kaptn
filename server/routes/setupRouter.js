const express = require('express');
const { exec, execSync, spawn, spawnSync } = require('child_process');
const router = express.Router();
const setupController = require('../controllers/setupController');

// setupController.promInit

router.get('/promsetup', setupController.promInit, (req, res) => {
  console.log('in setup router');
  return res.sendStatus(200);
});

router.get('/grafana', setupController.grafInit, (req, res) => {
  console.log('Grafana setup complete');
  return res.sendStatus(200);
});

router.get('/forwardports', setupController.forwardPorts, (req, res) => {
  console.log('Port forward finished');
  return res.sendStatus(200);
});

module.exports = router;
