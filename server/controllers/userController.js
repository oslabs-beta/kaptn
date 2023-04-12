const Users = require('../models/userModel');
var qs = require('querystring')

const userController = {};

userController.createUser = async (req, res, next) => {
  console.log('in create user');
  const body = qs.parse(req.body)
  console.log(body)
//destructuring usesr input from request body
  // const { username, email, password } = req.body;
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
  console.log('IN VERIFY USER')
  // const body = Object.keys(req.body);
  console.log(req.body)
  // const request = req.json()
  // console.log(request)
//destructuring email and password from request body
  // const values = Object.values(body[0]);
  // const username = values[0];
  // const password = values[1];
  const { username, password } = req.body;
  console.log('USERNAME', username);
  console.log('PASSWORD', password);
  //declare constant user, initialized to first instance of entry with matching username in User DB
  const user = await Users.findOne({ username });
  //if user does not exist, return error
  if (!user) {
    res.locals.error = 'Incorrect email';
    return next();
  }
  //if user exists and entered password matches user's password in DB, 
  if (password === user.password) {
    console.log('id in verifyUser', user._id);
    res.locals.id = user._id;
    console.log(res.locals.id);
    return next();
  } else {
    res.locals.error = 'Incorrect password';
    return next();
  }
};

module.exports = userController;