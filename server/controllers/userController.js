const Users = require('../models/userModel');
var qs = require('querystring');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createUser = async (req, res, next) => {
    console.log('in create user');
    console.log(req.body)
    //Because of the header type, our request is formatted as {"{}":''}, so we need
    //parse the first (and only) key into an object, which is body
    const reqBody = Object.keys(req.body)[0];
    const body = JSON.parse(reqBody)
    const { username, email, password } = body;
    // const hashedPw = bcrypt.hash(password, 10)
    console.log('USERNAME', username);
    console.log('PASSWORD', password);
    console.log('email', email);
    console.log(body)     
//   } 
  try {
    //check to ensure all 3 inputs were entered, can later adjust to only username and password if needed
    if (username && email && password) {
        //create new user to User DB
      await Users.create({ username, email, password });
      return next();
    } else {
      throw new Error('Missing name, email, or password');
    }
  } catch (err) {
    //error handling
    next({
      log: 'Express error handler caught createUser middleware error',
      status: 400,
      message: { err: err.message },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  console.log('IN VERIFY USER:', req.body)
    const reqBody = Object.keys(req.body)[0];
    const body = JSON.parse(reqBody)
    console.log(body)
//destructuring email and password from request body
  const { username, password } = body;
  console.log('USERNAME', username);
  console.log('PASSWORD', password);
  //declare constant user, initialized to first instance of entry with matching username in User DB
  const user = await Users.findOne({ username });
  //if user does not exist, return error
  if (!user) {
    console.log('WRONG!!')
    res.locals.error = 'Incorrect email';
    return next({
      log: 'Express error handler caught unknown email error',
      status: 500,
      message: { err: 'An error occurred EMAIL' },
    });
  } else {
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.log('ERROR');
      return next({
        log: 'Express error handler caught unknown bcrypt.compare error',
        status: 500,
        message: { err: 'An error occurred COMPARE' },
      })
    }
    if (result === false) {
      console.log('incorrect password');
      return next({
        log: 'Express error handler caught incorrect password error',
        status: 500,
        message: { err: 'An error occurred PW' },
      })
    } if (result === true) {
      console.log('correct password')
      // console.log(res)
      // res.status = 200;
      return next()
    }
  });
  
  }

};

module.exports = userController;