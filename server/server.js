const express = require('express');
const app = express();
const path = require('path');
const apiRouter = require('./routes/apiRouter.js');
const userRouter = require('./routes/userRouter.js');
const clusterRouter = require('./routes/clusterRouter.js');
const setupRouter = require('./routes/setupRouter.js');

const mongoose = require('mongoose');

// changing port here for grafana
const PORT = 6666;

// Connect to mongo database
mongoose.connect(
  'mongodb+srv://osp5:9dm8OGGfECIJmZdQ@cluster.zboxzus.mongodb.net/test'
);

// Upon successful connection, send update to console
mongoose.connection.once('open', () => {
  console.log('WE IN DIS DB');
});

// Add body parser
app.use(express.json());

// Handle routes to /api
app.use('/api', apiRouter);

// Handle routes to /user
app.use('/user', userRouter);

app.use(express.static(path.join(__dirname, '../index')));

// Yining addition: Handle routes to /clusterinfo
// app.use('/clusterinfo', clusterRouter);
app.use('/prom-graf-setup', setupRouter);

// Handle invalid endpoint
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Handle errors
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
