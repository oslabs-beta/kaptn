const clusterController = {};
const k8s = require('@kubernetes/client-node');
const { HttpStatusCode } = require('axios');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// GET ALL PODS
clusterController.getPods = async (req, res, next) => {
  await k8sApi.listNamespacedPod('default').then((res) => {
    console.log('we getting dem pods');
    console.log(res.body);
  }).catch((err) => {
    console.log(err);
  })
};

// GET NAMESPACES
clusterController.getNameSpaces = async (req, res, next) => {
  await k8sApi.listNamespace('default').then((res) => {
    console.log(res.body);
    return next();
  });
};

// GET CLUSTER INFO
clusterController.getClusterInfo = async (req, res, next) => {
  try {
    const pods = await getPods();
    const namespaces = await getNameSpaces();
    const clusterInfo = { pods, namespaces };
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

module.exports = clusterController;
