const express = require('express');
const app = express();
const path = require('path');
const apiRouter = require('./routes/apiRouter.js');
const mongoose = require('mongoose');

//connect to mongo database
mongoose.connect('mongodb+srv://osp5:9dm8OGGfECIJmZdQ@cluster.zboxzus.mongodb.net/test')

//console.log DATABASE CONNECTED once connection is successful
mongoose.connection.once('open', () => {
  console.log('WE IN DIS DB');
});

const PORT = 3000;

//??not sure what this does
app.use(express.urlencoded({ extended: true }));

// Body parser
app.use(express.json());

//designating /api as endpoint of apiRouter????????
app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, '../index')));
app.get('/api', (req, res) => {
  // res.status(200).sendFile(path.join(__dirname, '/index.html'));
  res.send('weinhere')
})

// Endpoint does not exist
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
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
