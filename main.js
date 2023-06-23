const path = require('path');
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  globalShortcut,
} = require('electron');
const { exec, spawnSync, spawn } = require('child_process');
const { dialog } = require('electron');
const isDev = process.env.NODE_ENV === 'development';
const { clipboard } = require('electron');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 11.5, y: 8 },
    width: 1100,
    height: 800,
    minWidth: 1100,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // var template = [
  //   {
  //     label: 'Application',
  //     submenu: [
  //       {
  //         label: 'About Application',
  //         selector: 'orderFrontStandardAboutPanel:',
  //       },
  //       { type: 'separator' },
  //       {
  //         label: 'Quit',
  //         accelerator: 'Command+Q',
  //         click: function () {
  //           app.quit();
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     label: 'Edit',
  //     submenu: [
  //       { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
  //       { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
  //       { type: 'separator' },
  //       { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
  //       { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
  //       { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
  //       {
  //         label: 'Select All',
  //         accelerator: 'CmdOrCtrl+A',
  //         selector: 'selectAll:',
  //       },
  //     ],
  //   },
  // ];

  // Menu.setApplicationMenu(Menu.buildFromTemplate(template));

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
  let returnValue;
  let podName;
  const getFunc = exec('kubectl get pods', (err, stdout, stderr) => {
    if (err) {
      returnValue = `exec error: ${err}`;
    }
    if (stderr) {
      returnValue = `stderr: ${stderr}`;
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
  });
  return event.sender.send(
    'graf_setup',
    `Grafana setup complete: ${returnValue}`
  );
});

// Listen to forward_ports event
ipcMain.on('forward_ports', (event, arg) => {
  let returnData = '';
  const ports = spawn(
    `kubectl port-forward deployment/prometheus666-grafana 3000`,
    {
      shell: true,
    }
  );

  ports.stderr.on('data', (data) => {
    returnData = `port forwarding error: ${data}`;
    console.log(returnData);
    return event.sender.send('forward_ports', returnData);
  });

  ports.stdout.on('data', (data) => {
    returnData = `stdout: ${data}`;
    console.log(returnData);
    return event.sender.send('forward_ports', returnData);
  });
});

ipcMain.on('retrieve_key', (event, arg) => {
  const cacheKey = 'api_key';

  // Helper function to retrieve the API key
  const getAPIKey = async () => {
    try {
      // If the API key is not in the cache, fetch it from the API
      const response = await fetch('http://localhost:3000/api/auth/keys', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          Authorization:
            'Basic ' + Buffer.from('admin:prom-operator').toString('base64'),
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: Math.random().toString(36).substring(7),
          role: 'Admin',
          secondsToLive: 86400,
        }),
      });

      const data = await response.json();

      // Send the fetched response
      // console.log('data.key is:', data.key);
      let key = data.key;
      // return event.sender.send('retrieve_key', data);

      const arg = {
        dashboard: 'Kubernetes / API server',
      };
      const { dashboard } = arg;
      // console.log('arg is:', arg);
      console.log('key is:', key);
      console.log('dashboard is:', dashboard);
      // const cachedValue = await redis.get(dashboard);

      // // Return the cached UID if it exists
      // if (cachedValue !== null) {
      //   return event.sender.send('retrieve_uid', cachedValue);
      // }

      let encodedDash = encodeURIComponent(dashboard);
      // If the UID is not in the cache, fetch it from the API
      let response2 = await fetch(
        `http://localhost:3000/api/search?query=${encodedDash}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let data2 = await response2.json();
      console.log('data is', data2);

      // Send the fetched response
      let uid = data2[0].uid;
      console.log('uid is:', uid);

      const now = new Date().getTime();
      const from = new Date(now - 60 * 60 * 1000).getTime();
      let url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=${from}&to=${now}&kiosk=true`;
      console.log('attempting to open:', url);
      require('electron').shell.openExternal(url);
      return event.sender.send('retrieve_key', `true`);
    } catch (error) {
      console.log(error);
      return event.sender.send('retrieve_key', `Error: ${error}`);
    }
  };

  getAPIKey();

  // const getUID = async () => {
  //   try {
  //     const arg = {
  //       dashboard: 'Kubernetes / API server',
  //     };
  //     const { dashboard } = arg;
  //     console.log('arg is:', arg);
  //     console.log('key is:', key);
  //     console.log('dashboard is:', dashboard);
  //     // const cachedValue = await redis.get(dashboard);

  //     // // Return the cached UID if it exists
  //     // if (cachedValue !== null) {
  //     //   return event.sender.send('retrieve_uid', cachedValue);
  //     // }

  //     let encodedDash = encodeURIComponent(dashboard);
  //     // If the UID is not in the cache, fetch it from the API
  //     let response = await fetch(
  //       `http://localhost:3000/api/search?query=${encodedDash}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${key}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     let data = await response.json();
  //     console.log('data is', data);

  //     // Send the fetched response
  //     let uid = data[0].uid;
  //     console.log('uid in getUID is:', uid);
  //     // getUID();
  //     const now = new Date().getTime();
  //     const from = new Date(now - 60 * 60 * 1000).getTime();
  //     url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=${from}&to=${now}&kiosk=true`;
  //     console.log('attempting to open:', url);
  //     require('electron').shell.openExternal(url);
  //     // return event.sender.send('retrieve_uid', uid);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
});

// Listen to retrieve_uid event
ipcMain.on('retrieve_uid', (event, arg) => {
  // Helper function to retrieve the UID key
});

ipcMain.on('openbrowser', (event, arg) => {
  event.returnValue = 'Message received!';
  const now = new Date().getTime();
  const from = new Date(now - 60 * 60 * 1000).getTime();
  url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=${from}&to=${now}&kiosk=true`;
  require('electron').shell.openExternal(url);
});

// Load the main window
app.whenReady().then(() => {
  createMainWindow();

  // // Register a 'CommandOrControl+Y' shortcut listener.
  // globalShortcut.register('CommandOrControl+c', (e) => {
  //   // Do stuff when Y and either Command/Control is pressed.
  //   clipboard.writeText(e);
  // });
  // globalShortcut.register('CommandOrControl+v', () => {
  //   // Do stuff when Y and either Command/Control is pressed.
  //   clipboard.readText();
  // });
});
