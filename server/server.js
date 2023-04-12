const express = require('express');
const app = express();
const path = require('path');
const apiRouter = require('./routes/apiRouter.js');

const PORT = 3000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api', apiRouter);

// Send static files
// app.use(express.static(path.join(__dirname, '../index')));

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
