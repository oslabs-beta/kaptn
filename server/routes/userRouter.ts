import * as express from 'express'
import userController from '../controllers/userController'

const userRouter = express.Router();
// Handle POST request to create new user
userRouter.post('/createuser', userController.createUser, (req: express.Request, res: express.Response) => {
  res.status(200).json('User Created');
});

// Handle POST request to verify user on login
userRouter.post('/login', userController.verifyUser, (req: express.Request, res: express.Response) => {
  res.status(200).json('Login Successful');
});

export default userRouter;
