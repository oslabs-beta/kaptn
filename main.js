const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { exec, spawnSync, spawn } = require("child_process");
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
    // mainWindow.webContents.openDevTools();
  } else {
    //in production, fix env.PATH for correct CLI use
    fixPath();
    // In production, render the html build file
    mainWindow.loadURL(`file://${__dirname}/./dist/index.html#`);
  }
}

/******** EVENT LISTENERS ********/

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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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


//Listen for command to delete/restart a pod
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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

// Listen to post_command event
ipcMain.on("post_command", (event, arg) => {
  const { command, currDir } = arg;

  // if kubectl command is entered with no directory chosen, use ZDOTDIR as directory address when calling exec command --- otherwise ("else" on line 55) submit command normally
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
