import k8s from '@kubernetes/client-node';
import * as express from 'express';

const clusterController: { [key: string]: any} = {}

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// GET ALL PODS
clusterController.getPods = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  await k8sApi.listNamespacedPod('default').then((res) => {
    console.log('we getting dem pods');
    console.log(res.body);
  }).catch((err) => {
    console.log(err);
  })
};

// GET NAMESPACES
clusterController.getNameSpaces = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  await k8sApi.listNamespace('default').then((res) => {
    console.log(res.body);
    return next();
  });
};

// GET CLUSTER INFO
clusterController.getClusterInfo = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    const pods = await clusterController.getPods();
    const namespaces = await clusterController.getNameSpaces();
    const clusterInfo = { pods: [], namespaces: [] };
    console.log('cluser info', clusterInfo);
    return next();
  } catch (err) {
    return next({
      log: `An error occurred in the clustController.getCluster info ERROR: ${err}`,
      status: 500,
      message: { err: 'An error occurred in getClusterInfo' },
    });
  }
};

export default clusterController;
