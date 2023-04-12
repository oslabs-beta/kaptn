const Users = require('../models/userModel');
var qs = require('querystring')

const userController = {};

userController.createUser = async (req, res, next) => {
    console.log('in create user');
//   const body = qs.parse(req.body)
//   console.log(body)
//destructuring usesr input from request body
    console.log(req.body)
//   const reqBody = Object.keys(req.body)[0];
//   const body = JSON.parse(reqBody)
//   console.log(body)  
  
//   if (Object.values(req.body)[0] !== '') {
//     const { username, email, password } = req.body;
//     console.log('USERNAME', username);
//     console.log('PASSWORD', password);
//     console.log('email', email);     
//   } else {
    //Because of the header type, our request is formatted as {"{}":''}, so we need
    //parse the first (and only) key into an object, which is body
    const reqBody = Object.keys(req.body)[0];
    const body = JSON.parse(reqBody)
    //the username, email, and password variables are not persisting through the try block? which is
    //why creating new user through postman (through if condition above) works
    //while creating through app (through this else condition) doesn't work
    const { username, email, password } = body;
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
  // const body = Object.keys(req.body);
  // const request = req.json()
  // console.log(request)
//destructuring email and password from request body
  // const values = Object.values(body[0]);
  // const username = values[0];
  // const password = values[1];
  const { username, password } = body;
  console.log('USERNAME', username);
  console.log('PASSWORD', password);
  //declare constant user, initialized to first instance of entry with matching username in User DB
  const user = await Users.findOne({ username });
  //if user does not exist, return error
  if (!user) {
    console.log('WRONG!!')
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