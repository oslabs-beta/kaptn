const setupController = {};
const { exec, execSync, spawn, spawnSync } = require('child_process');

setupController.promInit = (req, res, next) => {
  console.log('Prometheus setup starting');

  // this command adds chart repository to helm
  spawnSync(
    'helm repo add prometheus-community https://prometheus-community.github.io/helm-charts',
    { stdio: 'inherit', shell: true }
  );

  // // update helm
  spawnSync('helm repo update', { stdio: 'inherit', shell: true });

  // // install helm chart
  spawnSync(
    'helm install prometheus666 prometheus-community/kube-prometheus-stack',
    { stdio: 'inherit', shell: true }
  );
  return next();
};

setupController.grafInit = (req, res, next) => {
  console.log('Grafana embedding...');
  console.log('we in dis mf grafana controller bs');
  let podName;
  const getFunc = exec('kubectl get pods', (err, stdout, stderr) => {
    if (err) {
      console.log(`exec error: ${err}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    const output = stdout.split('\n');
    output.forEach((pod) => {
      if (pod.includes('prometheus666-grafana')) {
        [podName] = pod.split(' ');
      }
    });
    console.log(podName);
  });

  getFunc.once('close', () => {
    spawnSync('kubectl apply -f prometheus666-grafana.yaml', {
      studio: 'inherit',
      shell: true,
    });
    spawnSync(`kubectl delete pod ${podName}`, {
      stdio: 'inherit',
      shell: true,
    });
    return next();
  });
};

setupController.forwardPorts = (req, res, next) => {
  console.log('Forwarding ports');
  // let grafPod;
  // let promPod;
  // let alertPod;
  // let podStatus;
  // console.log('what')
  // while (podStatus !== 'Running') {
  //   const podsList = execSync('kubectl get pods');
  //   console.log(podList.toString());
  //   podsList
  //     .toString()
  //     .split('\n')
  //     .forEach((pod) => {
  //       if (!promPod && line.includes('prometheus-0'))
  //         [promPod] = pod.split('');
  //       if (!alertPod && pod.includes('alertmanager-0'))
  //         [alertPod] = pod.split('');
  //       if (pod.includes('prometheus666-grafana')) {
  //         if (pod.includes('Running')) podStatus = 'Running';
  //         [grafPod] = line.split('');
  //       }
  //       console.log('grafana pod:', grafPod);
  //     });
  // }
  const ports = spawn(`kubectl port-forward deployment/prometheus-grafana 3000`, {
    shell: true,
  });
  ports.stdout.on('result', (result) => {
    console.log(`stdout: ${result}`);
  });
  ports.stderr.on('result', (result) => {
    console.error(`grafana port forwarding error: ${result}`)
  });
  return next();
};

module.exports = setupController;
