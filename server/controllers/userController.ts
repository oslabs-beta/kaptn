import Users from '../models/UserModel';
import bcrypt from 'bcryptjs';
import * as express from 'express';

const userController: Record<string, any> = {}

type CreateUserRequestBody = Record<'username' | 'email' | 'password', string> 

type VerifyUserRequestBody = Record<'username' | 'password', string>

// Create user in the database
userController.createUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  const { username, email, password } = req.body as CreateUserRequestBody;
  try {
    await Users.create({ username, email, password });
    // If the user is created, return next
    return next();
  } catch (err) {
    // If there is an error, invoke global error handler
    next({
      log: 'Express error handler caught createUser middleware error',
      status: 400,
      message: { err: 'An error occured CREATE' },
    });
  }
};

// Verify user on login attempt
userController.verifyUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>  => {
  const { username, password } = req.body as VerifyUserRequestBody;
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
    bcrypt.compare(password, user.password, (err: Error, result: boolean) => {
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

export default userController;