const Users = require('../models/UserModel');
var qs = require('querystring');
const bcrypt = require('bcryptjs');

const userController = {};

// Create user in the database
userController.createUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await Users.create({ username, email, password });
    // If the user is created, return next
    return next();
  } catch (err) {
    // If there is an error, invoke global error handler
    next({
      log: 'Express error handler caught createUser middleware error',
      status: 400,
      message: { err: err.message },
    });
  }
};

// Verify user on login attempt
userController.verifyUser = async (req, res, next) => {
  const { username, password } = req.body;
  // Find if the user exists in the database
  const user = await Users.findOne({ username });
  // If user does not exist, return error
  if (!user) {
    return next({
      log: 'Express error handler caught unknown email error',
      status: 500,
      message: { err: 'An error occurred EMAIL' },
    });
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      // If there is an error in hashing the password, return error
      if (err) {
        return next({
          log: 'Express error handler caught unknown bcrypt.compare error',
          status: 500,
          message: { err: 'An error occurred COMPARE' },
        });
      }
      // If the password does not exist, return error
      if (result === false) {
        console.log('incorrect password');
        return next({
          log: 'Express error handler caught incorrect password error',
          status: 500,
          message: { err: 'An error occurred PW' },
        });
      }
      // Otherwise, if the password is correct, return next
      if (result === true) {
        console.log('correct');
        return next();
      }
    });
  }
};

module.exports = userController;
