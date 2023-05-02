import * as express from 'express';
import apiController from '../controllers/apiController.ts';

const apiRouter = express.Router();

apiRouter.post('/', apiController.postCommand, (req: express.Request, res: express.Response) => {
  return res.status(200).json(res.locals.cliResponse);
});

export default apiRouter;
