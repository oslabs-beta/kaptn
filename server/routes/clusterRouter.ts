import * as express from 'express';
import clusterController from '../controllers/clusterController';

const clusterRouter = express.Router();

// router.get('/', clusterController.getClusterInfo, (req, res) => {
//   return res.status(200);
// })

clusterRouter.get( '/', clusterController.getPods, (req: express.Request, res: express.Response) => {
  return res.status(200);
})

export default clusterRouter;

