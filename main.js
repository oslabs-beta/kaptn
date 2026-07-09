const path = require("path");
const { app, BrowserWindow, ipcMain, ipcRenderer, session } = require("electron");
const { exec, spawnSync, spawn, execSync } = require("child_process");
const fixPath = require("fix-path");

// const storage = require("electron-json-storage");

const isDev = process.env.NODE_ENV === "development";

// Command to read the Grafana admin password from the cluster secret. Uses the
// standard grafana chart label so it is independent of the Helm release name or
// namespace.
const GRAFANA_PASSWORD_COMMAND =
  "kubectl get secret -l app.kubernetes.io/name=grafana --all-namespaces -o jsonpath='{.items[0].data.admin-password}' | base64 --decode";

// Resolve the live Grafana admin password. Resolves to "" if the secret can't
// be read, letting each caller choose its own fallback. Never logs the value.
function getGrafanaPassword() {
  return new Promise((resolve) => {
    exec(
      GRAFANA_PASSWORD_COMMAND,
      { cwd: process.env.ZDOTDIR },
      (err, stdout) => {
        resolve(err || !stdout ? "" : stdout.trim());
      }
    );
  });
}

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
      // enables the <webview> tag used to embed the Grafana dashboard inline
      webviewTag: true,
      // enableRemoteModule: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:4444/");
    // mainWindow.webContents.openDevTools();
  } else {
    //in production, fix env.PATH for correct CLI use
    fixPath();
    // In production, render the html build file
    mainWindow.loadURL(`file://${__dirname}/./dist/index.html#`);
  }
}

/******** EVENT LISTENERS ********/

//get user directory for kaptn terminal use
ipcMain.on("getDirectory_command", (event, arg) => {
  const { getDirectoryCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    console.log("kubdir is:", kubDir);
    exec(` ${getDirectoryCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = kubDir;
        return event.sender.send("got_directory", app.getPath("home"));
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_directory", app.getPath("home"));
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_directory", app.getPath("home"));
    });
  } else {
    exec(` ${getDirectoryCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = kubDir;
        return event.sender.send("got_directory", app.getPath("home"));
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_directory", app.getPath("home"));
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_directory", app.getPath("home"));
    });
  }
});


//************************************************************** */
//***               START PAGE - IPC methods                 *** */
//************************************************************** */

//Listen for check if prometheus and grafana are installed
ipcMain.on("check_promgraf_installed", (event, arg) => {
  const { kubectlCheckPromGrafInstallCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${kubectlCheckPromGrafInstallCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("checked_promgraf_installed", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("checked_promgraf_installed", stdout);
      }
    );
  } else {
    exec(
      ` ${kubectlCheckPromGrafInstallCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("checked_promgraf_installed", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("checked_promgraf_installed", stdout);
      }
    );
  }
});

//Listen for check if metrics server is installed
ipcMain.on("check_metrics_installed", (event, arg) => {
  const { kubectlCheckMetricsInstallCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${kubectlCheckMetricsInstallCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("checked_metrics_installed", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("checked_metrics_installed", stdout);
      }
    );
  } else {
    exec(
      ` ${kubectlCheckMetricsInstallCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("checked_metrics_installed", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("checked_metrics_installed", stdout);
      }
    );
  }
});

//Listen for check if kubectl commands installed
ipcMain.on("check_kubectl_installed", (event, arg) => {
  const { kubectlCheckKubectlInstallCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${kubectlCheckKubectlInstallCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("checked_kubectl_installed", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("checked_kubectl_installed", stdout);
      }
    );
  } else {
    exec(
      ` ${kubectlCheckKubectlInstallCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("checked_kubectl_installed", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("checked_kubectl_installed", stdout);
      }
    );
  }
});

//Listen for attempt to install metrisc server
ipcMain.on("install_metrics_server_command", (event, arg) => {
  const { kubectlMetricsServerInstallCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${kubectlMetricsServerInstallCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("installed_metrics", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("installed_metrics", stdout);
      }
    );
  } else {
    exec(
      ` ${kubectlMetricsServerInstallCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("installed_metrics", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("installed_metrics", stdout);
      }
    );
  }
});

//************************************************************ */
//***               KRANE PAGE ipc methods                 *** */
//************************************************************ */

//Listen for command to get namespaces
ipcMain.on("getNamespaces_command", (event, arg) => {
  const { namespacesCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${namespacesCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_namespaces", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_namespaces", stdout);
    });
  } else {
    exec(` ${namespacesCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_namespaces", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_namespaces", stdout);
    });
  }
});

//Listen for command to get deployments info
ipcMain.on("getDeployments_command", (event, arg) => {
  const { deploymentsCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${deploymentsCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_deployments", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_deployments", stdout);
    });
  } else {
    exec(` ${deploymentsCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_deployments", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_deployments", stdout);
    });
  }
});

//Listen for command to get replicaSets info
ipcMain.on("getReplicas_command", (event, arg) => {
  const { getReplicasCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${getReplicasCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_rs", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_rs", stdout);
    });
  } else {
    exec(` ${getReplicasCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_rs", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_rs", stdout);
    });
  }
});

//Listen for command to view a podd logs
ipcMain.on("deploymentLogs_command", (event, arg) => {
  const { deploymentLogsCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;

    let finalReturnValue1 = execSync(`${deploymentLogsCommand}`, {
      encoding: "utf8",
    });

    return event.sender.send("deploymentLogsRetrieved", finalReturnValue1);
  } else {
    let finalReturnValue1 = execSync(`${deploymentLogsCommand}`, {
      encoding: "utf8",
    });

    return event.sender.send("deploymentLogsRetrieved", finalReturnValue1);
  }
});

//Listen for command to delete/restart a pod
ipcMain.on("deploymentYaml_command", (event, arg) => {
  const { deploymentYamlCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentYamlCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentYamlRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentYamlRetrieved", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentYamlCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentYamlRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentYamlRetrieved", stdout);
      }
    );
  }
});

//Listen for command to view pod describe
ipcMain.on("deploymentDescribe_command", (event, arg) => {
  const { deploymentDescribeCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentDescribeCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentDescribeRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentDescribeRetrieved", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentDescribeCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentDescribeRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentDescribeRetrieved", stdout);
      }
    );
  }
});

//Listen for command to view deployment rollout status
ipcMain.on("deploymentRolloutStatus_command", (event, arg) => {
  const { deploymentRolloutStatusCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentRolloutStatusCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentRolloutStatusRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentRolloutStatusRetrieved", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentRolloutStatusCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentRolloutStatusRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentRolloutStatusRetrieved", stdout);
      }
    );
  }
});

//Listen for command to view deployment rollout status
ipcMain.on("deploymentRolloutHistory_command", (event, arg) => {
  const { deploymentRolloutHistoryCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentRolloutHistoryCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentRolloutHistoryRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentRolloutHistoryRetrieved", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentRolloutHistoryCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deploymentRolloutHistoryRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deploymentRolloutHistoryRetrieved", stdout);
      }
    );
  }
});

//Listen for command to delete/restart a node
ipcMain.on("deleteDeployment_command", (event, arg) => {
  const { deploymentDeleteCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentDeleteCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deleted_deployment", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deleted_deployment", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentDeleteCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("deleted_deployment", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("deleted_deployment", stdout);
      }
    );
  }
});

//Listen for command to view deployment rollout status
ipcMain.on("rollbackPreviousDeployment_command", (event, arg) => {
  const { deploymentRollbackPreviousCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentRollbackPreviousCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("rolledBackPrevious_deployment", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("rolledBackPrevious_deployment", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentRollbackPreviousCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("rolledBackPrevious_deployment", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("rolledBackPrevious_deployment", stdout);
      }
    );
  }
});

//Listen for command to rolling restart deployment
ipcMain.on("rollingRestartDeployment_command", (event, arg) => {
  const { deploymentRollingRestartCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentRollingRestartCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send(
            "completedRollingRestart_deployment",
            stderr
          );
        }
        // Handle successful command execution with no errors
        return event.sender.send("completedRollingRestart_deployment", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentRollingRestartCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send(
            "completedRollingRestart_deployment",
            stderr
          );
        }
        // Handle successful command execution with no errors
        return event.sender.send("completedRollingRestart_deployment", stdout);
      }
    );
  }
});

//Listen for command to delete/restart a node
ipcMain.on("scaleDeployment_command", (event, arg) => {
  const { deploymentScaleCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${deploymentScaleCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("scaled_deployment", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("scaled_deployment", stdout);
      }
    );
  } else {
    exec(
      ` ${deploymentScaleCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("scaled_deployment", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("scaled_deployment", stdout);
      }
    );
  }
});

//Listen for command to get a pod containers
ipcMain.on("podContainers_command", (event, arg) => {
  const { podContainersCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${podContainersCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("podContainersRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("podContainersRetrieved", stdout);
    });
  } else {
    exec(
      ` ${podContainersCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("podContainersRetrieved", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("podContainersRetrieved", stdout);
      }
    );
  }
});
//********************* EXPANDED NODE FUNCTIONS ********************** */

//Listen for command to view a nodes logs
ipcMain.on("nodeLogs_command", (event, arg) => {
  const { nodeLogsCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodeLogsCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("nodeLogsRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("nodeLogsRetrieved", stdout);
    });
  } else {
    exec(` ${nodeLogsCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("nodeLogsRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("nodeLogsRetrieved", stdout);
    });
  }
});

//Listen for command to delete/restart a pod
ipcMain.on("nodeYaml_command", (event, arg) => {
  const { nodeYamlCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodeYamlCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("nodeYamlRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("nodeYamlRetrieved", stdout);
    });
  } else {
    exec(` ${nodeYamlCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("nodeYamlRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("nodeYamlRetrieved", stdout);
    });
  }
});

//Listen for command to view pod describe
ipcMain.on("nodeDescribe_command", (event, arg) => {
  const { nodeDescribeCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodeDescribeCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("nodeDescribeRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("nodeDescribeRetrieved", stdout);
    });
  } else {
    exec(` ${nodeDescribeCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("nodeDescribeRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("nodeDescribeRetrieved", stdout);
    });
  }
});

//Listen for command to drain a node
ipcMain.on("drainNode_command", (event, arg) => {
  const { nodeDrainCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodeDrainCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("drained_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("drained_node", stdout);
    });
  } else {
    exec(` ${nodeDrainCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("drained_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("drained_node", stdout);
    });
  }
});

//Listen for command to cordon a node
ipcMain.on("cordonNode_command", (event, arg) => {
  const { nodeCordonCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodeCordonCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("cordoned_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("cordoned_node", stdout);
    });
  } else {
    exec(` ${nodeCordonCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("cordoned_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("cordoned_node", stdout);
    });
  }
});

//Listen for command to uncordon a node
ipcMain.on("uncordonNode_command", (event, arg) => {
  const { nodeUncordonCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodeUncordonCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("uncordoned_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("uncordoned_node", stdout);
    });
  } else {
    exec(` ${nodeUncordonCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("uncordoned_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("uncordoned_node", stdout);
    });
  }
});

//Listen for command to delete/restart a node
ipcMain.on("deleteNode_command", (event, arg) => {
  const { nodeDeleteCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodeDeleteCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("deleted_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("deleted_node", stdout);
    });
  } else {
    exec(` ${nodeDeleteCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("deleted_node", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("deleted_node", stdout);
    });
  }
});

//********************* EXPANDED POD FUNCTIONS ********************** */

//Listen for command to view a podd logs
ipcMain.on("podLogs_command", (event, arg) => {
  const { podLogsCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${podLogsCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("podLogsRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("podLogsRetrieved", stdout);
    });
  } else {
    exec(` ${podLogsCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("podLogsRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("podLogsRetrieved", stdout);
    });
  }
});

//Listen for command to delete/restart a pod
ipcMain.on("podYaml_command", (event, arg) => {
  const { podYamlCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${podYamlCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("podYamlRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("podYamlRetrieved", stdout);
    });
  } else {
    exec(` ${podYamlCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("podYamlRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("podYamlRetrieved", stdout);
    });
  }
});

//Listen for command to view pod describe
ipcMain.on("podDescribe_command", (event, arg) => {
  const { podDescribeCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${podDescribeCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("podDescribeRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("podDescribeRetrieved", stdout);
    });
  } else {
    exec(` ${podDescribeCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("podDescribeRetrieved", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("podDescribeRetrieved", stdout);
    });
  }
});

//Listen for command to delete/restart a pod
ipcMain.on("deletePod_command", (event, arg) => {
  const { podDeleteCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${podDeleteCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("deleted_pod", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("deleted_pod", stdout);
    });
  } else {
    exec(` ${podDeleteCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("deleted_pod", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("deleted_pod", stdout);
    });
  }
});

//*********************************  NODE LIST METHODS ******** */

//Listen for attempt to get pod cpu's used
ipcMain.on("getNodesCpuUsed_command", (event, arg) => {
  const { nodesCpuUsedCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${nodesCpuUsedCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_nodesCpuUsed", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_nodesCpuUsed", stdout);
    });
  } else {
    exec(` ${nodesCpuUsedCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_nodesCpuUsed", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_nodesCpuUsed", stdout);
    });
  }
});

//Listen for attempt to get pod cpu's used
ipcMain.on("getNodesCpuLimits_command", (event, arg) => {
  const { nodesCpuLimitsCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(
      ` ${nodesCpuLimitsCommand}`,
      { cwd: kubDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("got_nodesCpuLimits", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("got_nodesCpuLimits", stdout);
      }
    );
  } else {
    exec(
      ` ${nodesCpuLimitsCommand}`,
      { cwd: currDir },
      (err, stdout, stderr) => {
        // Handle failed command execution
        if (err) {
          let output = err;
        }
        // Handle successful command execution but returned error (stderr)
        if (stderr) {
          return event.sender.send("got_nodesCpuLimits", stderr);
        }
        // Handle successful command execution with no errors
        return event.sender.send("got_nodesCpuLimits", stdout);
      }
    );
  }
});

//*********************************  POD LIST METHODS ******** */

//Listen for attempt to get pod cpu's used
ipcMain.on("getCpuUsed_command", (event, arg) => {
  const { CpuUsedCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${CpuUsedCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_cpuUsed", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_cpuUsed", stdout);
    });
  } else {
    exec(` ${CpuUsedCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_cpuUsed", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_cpuUsed", stdout);
    });
  }
});

//Listen for attempt to get pod cpu's used
ipcMain.on("getCpuLimits_command", (event, arg) => {
  const { cpuLimitsCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${cpuLimitsCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_cpuLimits", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_cpuLimits", stdout);
    });
  } else {
    exec(` ${cpuLimitsCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_cpuLimits", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_cpuLimits", stdout);
    });
  }
});

//Listen to Krane get nodes command event
ipcMain.on("getNodes_command", (event, arg) => {
  const { kraneCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${kraneCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_nodes", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_nodes", stdout);
    });
  } else {
    exec(` ${kraneCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_nodes", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_nodes", stdout);
    });
  }
});

//Listen to Krane get nodes command event
ipcMain.on("getPods_command", (event, arg) => {
  const { podsCommand, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
  if (currDir === "NONE SELECTED") {
    let kubDir = process.env.ZDOTDIR;
    exec(` ${podsCommand}`, { cwd: kubDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_pods", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_pods", stdout);
    });
  } else {
    exec(` ${podsCommand}`, { cwd: currDir }, (err, stdout, stderr) => {
      // Handle failed command execution
      if (err) {
        let output = err;
      }
      // Handle successful command execution but returned error (stderr)
      if (stderr) {
        return event.sender.send("got_pods", stderr);
      }
      // Handle successful command execution with no errors
      return event.sender.send("got_pods", stdout);
    });
  }
});

//************************************************************ */
//***               CLI TERMINAL ipc method                *** */
//************************************************************ */

// Listen to post_command event
ipcMain.on("post_command", (event, arg) => {
  const { command, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on further down) submit command normally
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

//************************************************************ */
//***            CLUSTER METRICS ipc methods               *** */
//************************************************************ */

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

// Listen to forward_ports kill port event
ipcMain.on("kill_port", (event, arg) => {
  const ports = spawn(`kill -9 $(lsof -ti:3000)`, {
    shell: true,
  });
});

// retrieve the live Grafana admin password from the cluster secret.
// Uses the standard grafana chart label so it works regardless of the Helm
// release name or namespace, rather than a hardcoded secret name.
ipcMain.on("get_grafana_password", (event, arg) => {
  getGrafanaPassword().then((password) => {
    // don't log the password — it's a plaintext credential
    event.sender.send(
      "get_grafana_password",
      password || "COULD NOT RETRIEVE"
    );
  });
});

// step 4 - retrieve uid and launch metrics analyzer in new browser window
ipcMain.on("retrieve_key", (event, arg) => {
  // Find the dashboard's UID, then open it in an authenticated in-app window.
  const launchDashboard = async () => {
    try {
      // Use the live Grafana password; fall back to the chart default so an
      // old-default install still works if the secret can't be read.
      const password = (await getGrafanaPassword()) || "prom-operator";
      const basicAuth =
        "Basic " + Buffer.from(`admin:${password}`).toString("base64");

      // Look up the dashboard's UID by title (authenticated with Basic auth).
      const dashboard = "Kubernetes / API server";
      const searchRes = await fetch(
        `http://localhost:3000/api/search?query=${encodeURIComponent(dashboard)}`,
        {
          method: "GET",
          headers: {
            Authorization: basicAuth,
            "Content-Type": "application/json",
          },
        }
      );
      const results = await searchRes.json();
      // /api/search returns an array of matches; the UID lives on the result
      // itself. The old code read it from the service-account response, which
      // is why the dashboard link never resolved.
      const uid =
        Array.isArray(results) && results.length ? results[0].uid : null;
      if (!uid) {
        return event.sender.send("retrieve_key", "Error: dashboard not found");
      }

      // Relative time range so each 10s refresh rolls the window forward and
      // live data keeps appearing. Absolute from/to timestamps froze the view
      // at the launch moment — refreshes kept re-fetching the same hour.
      const url = `http://localhost:3000/d/${uid}/kubernetes-api-server?orgId=1&refresh=10s&from=now-24h&to=now&kiosk`;

      // Inject Basic auth on every request to Grafana in this window's session
      // so it lands directly on the dashboard, past the login screen. This is
      // the reason we can't use shell.openExternal — that hands the URL to the
      // user's browser, which carries no auth, so Grafana shows its login page.
      const grafanaSession = session.fromPartition("grafana-metrics");
      grafanaSession.webRequest.onBeforeSendHeaders((details, callback) => {
        if (details.url.startsWith("http://localhost:3000")) {
          callback({
            requestHeaders: {
              ...details.requestHeaders,
              Authorization: basicAuth,
            },
          });
        } else {
          callback({ requestHeaders: details.requestHeaders });
        }
      });

      // Hand the resolved URL back to the renderer, which embeds it in a
      // <webview partition="grafana-metrics"> — the same partition whose
      // requests we just authenticated above, so it renders past the login
      // screen inline in the page instead of a separate window.
      return event.sender.send("retrieve_key", url);
    } catch (error) {
      return event.sender.send("retrieve_key", `Error: ${error}`);
    }
  };

  launchDashboard();
});

// Background stats collection — dedicated channels (separate from Krane's
// got_cpuUsed/got_nodesCpuUsed) so the app can accumulate CPU/memory history
// from launch without colliding with Krane's own listeners. Errors are
// swallowed (no cluster / metrics-server yet) so nothing is sent to collect.
ipcMain.on("bgPodStats_command", (event, arg) => {
  exec(
    "kubectl top pods --all-namespaces",
    { cwd: process.env.ZDOTDIR },
    (err, stdout) => {
      if (err || !stdout) return;
      event.sender.send("bg_got_podStats", stdout);
    }
  );
});

ipcMain.on("bgNodeStats_command", (event, arg) => {
  exec("kubectl top nodes", { cwd: process.env.ZDOTDIR }, (err, stdout) => {
    if (err || !stdout) return;
    event.sender.send("bg_got_nodeStats", stdout);
  });
});

// Load the main window
app.whenReady().then(() => {
  createMainWindow();
});
