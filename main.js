const path = require("path");
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  globalShortcut,
} = require("electron");
const { exec, spawnSync, spawn } = require("child_process");
const { dialog } = require("electron");
const { clipboard } = require("electron");
const fixPath = require("fix-path");

const isDev = process.env.NODE_ENV === "development";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Kaptn",
    titleBarStyle: "hidden",
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

  if (isDev) {
    mainWindow.loadURL("http://localhost:4444/");
    mainWindow.webContents.openDevTools();
  } else {
    //in production, fix env.PATH for correct CLI use
    fixPath();
    // In production, render the html build file
    mainWindow.loadURL(`file://${__dirname}/./dist/index.html#`);
  }
}

/******** EVENT LISTENERS ********/

// Listen to post_command event
ipcMain.on("post_command", (event, arg) => {
  const { command, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 64) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${command}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("post_command", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("post_command", stdout);
    });
  } else {
    exec(` ${command}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("post_command", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("post_command", stdout);
    });
  }
});

// Listen to prom_setup event
ipcMain.on("prom_setup", (event, arg) => {
  // This command adds chart repository to helm
  spawnSync(
    "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts",
    { stdio: "inherit", shell: true }
  );

  // Update helm
  spawnSync("helm repo update", { stdio: "inherit", shell: true });

  // Install helm chart
  spawnSync(
    "helm install prometheus666 prometheus-community/kube-prometheus-stack",
    { stdio: "inherit", shell: true }
  );

  return event.sender.send("prom_setup", "Prom setup complete");
});

// Listen to graf_setup event
ipcMain.on("graf_setup", (event, arg) => {
  let returnValue;
  let podName;
  const getFunc = exec("kubectl get pods", (err, stdout, stderr) => {
    if (err) {
      returnValue = `exec error: ${err}`;
    }
    if (stderr) {
      returnValue = `stderr: ${stderr}`;
    }

    const output = stdout.split("\n");
    output.forEach((pod) => {
      if (pod.includes("prometheus666-grafana")) {
        [podName] = pod.split(" ");
      }
    });
  });

  getFunc.once("close", () => {
    spawnSync("kubectl apply -f prometheus666-grafana.yaml", {
      studio: "inherit",
      shell: true,
    });
    spawnSync(`kubectl delete pod ${podName}`, {
      stdio: "inherit",
      shell: true,
    });
  });
  return event.sender.send(
    "graf_setup",
    `Grafana setup complete: ${returnValue}`
  );
});

// Listen to forward_ports event
ipcMain.on("forward_ports", (event, arg) => {
  let returnData = "";
  const ports = spawn(
    `kubectl port-forward deployment/prometheus666-grafana 3000`,
    {
      shell: true,
    }
  );

  ports.stderr.on("data", (data) => {
    returnData = `port forwarding error: ${data}`;
    return event.sender.send("forward_ports", returnData);
  });

  ports.stdout.on("data", (data) => {
    returnData = `stdout: ${data}`;
    return event.sender.send("forward_ports", returnData);
  });
});

// Listen to forward_ports event
ipcMain.on("kill_port", (event, arg) => {
  const ports = spawn(`kill -9 $(lsof -ti:3000)`, {
    shell: true,
  });
});

// step 4 - retrieve uid and launch metrics analyzer in new browser window 
ipcMain.on("retrieve_key", (event, arg) => {
  const cacheKey = "api_key";

  // Helper function to retrieve the API key and then UID
  const getAPIKey = async () => {
    try {
      // If the API key is not in the cache, fetch it from the API
      const response = await fetch("http://localhost:3000/api/auth/keys", {
        method: "POST",
        mode: "no-cors",
        headers: {
          Authorization:
            "Basic " + Buffer.from("admin:prom-operator").toString("base64"),
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Math.random().toString(36).substring(7),
          role: "Admin",
          secondsToLive: 86400,
        }),
      });

      const data = await response.json();

      let key = data.key;

      const arg = {
        dashboard: "Kubernetes / API server",
      };
      const { dashboard } = arg;

      let encodedDash = encodeURIComponent(dashboard);
      // If the UID is not in the cache, fetch it from the API
      let response2 = await fetch(
        `http://localhost:3000/api/search?query=${encodedDash}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
        }
      );

      let data2 = await response2.json();

      let uid = data2[0].uid;

      const now = new Date().getTime();
      const from = new Date(now - 60 * 60 * 1000).getTime();
      let url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=${from}&to=${now}&kiosk=true?username=admin&password=prom-operator`;
      require("electron").shell.openExternal(url);
      return event.sender.send("retrieve_key", `true`);
    } catch (error) {
      return event.sender.send("retrieve_key", `Error: ${error}`);
    }
  };

  getAPIKey();
});

// Load the main window
app.whenReady().then(() => {
  createMainWindow();
});
