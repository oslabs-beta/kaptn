const path = require('path');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { exec, spawnSync, spawn } = require('child_process');
const { dialog } = require('electron');
const isDev = process.env.NODE_ENV === 'development';

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: '100', y: '100' },
    width: 1100,
    height: 800,
    minWidth: 1100,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:4444/');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, render the html build file
    mainWindow.loadURL(`file://${path.join(__dirname, '/dist/index.html#/')}`);
  }
}

/******** EVENT LISTENERS ********/

// Listen to post_command event
ipcMain.on('post_command', (event, arg) => {
  const { command, currDir } = arg;

  exec(` ${command}`, { cwd: currDir }, (err, stdout, stderr) => {
    // Handle failed command execution
    if (err) {
      let output = err;
      // dialog.showErrorBox('', `${err}`);
      // return event.sender.send('post_command', output);
    }
    // Handle successful command execution but returned error (stderr)
    if (stderr) {
      // dialog.showErrorBox('Success execute, still error:', `${stderr}`);
      return event.sender.send('post_command', stderr);
    }
    // Handle successful command execution with no errors
    return event.sender.send('post_command', stdout);
  });
});

// Listen to prom_setup event
ipcMain.on('prom_setup', (event, arg) => {
  // This command adds chart repository to helm
  spawnSync(
    'helm repo add prometheus-community https://prometheus-community.github.io/helm-charts',
    { stdio: 'inherit', shell: true }
  );

  // Update helm
  spawnSync('helm repo update', { stdio: 'inherit', shell: true });

  // Install helm chart
  spawnSync(
    'helm install prometheus666 prometheus-community/kube-prometheus-stack',
    { stdio: 'inherit', shell: true }
  );

  return event.sender.send('prom_setup', 'Prom setup complete');
});

// Listen to graf_setup event
ipcMain.on('graf_setup', (event, arg) => {
  let podName;
  const getFunc = exec('kubectl get pods', (err, stdout, stderr) => {
    if (err) {
      console.log(`exec error: ${err}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }

    const output = stdout.split('\n');
    output.forEach((pod) => {
      if (pod.includes('prometheus666-grafana')) {
        [podName] = pod.split(' ');
      }
    });
    console.log('Pod name (Main.js, line 91): ', podName);
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
    return event.sender.send('graf_setup', 'Grafana setup complete');
  });
});

// Listen to forward_ports event
ipcMain.on('forward_ports', (event, arg) => {
  const ports = spawn(
    `kubectl port-forward deployment/prometheus666-grafana 3000`,
    {
      shell: true,
    }
  );

  ports.stderr.on('data', (data) => {
    console.log(`grafana port forwarding error: ${data}`);
  });

  ports.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    return event.sender.send('prom_setup', 'Port forward complete');
  });
});

// Load the main window
app.whenReady().then(() => {
  createMainWindow();
});
