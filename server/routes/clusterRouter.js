const express = require('express');
const router = express.Router();
const clusterController = require('../controllers/clusterController');


// router.get('/', clusterController.getClusterInfo, (req, res) => {
//   return res.status(200);
// })

router.get( '/', clusterController.getPods, (req, res) => {
  return res.status(200);
})


module.exports = router;

