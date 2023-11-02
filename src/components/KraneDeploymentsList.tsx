import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useTheme, Box, Modal, TextField } from "@mui/material";
const { ipcRenderer } = require("electron");
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
    color: "white",
    fontSize: 11,
  },
}));

function KraneDeploymentsList(props) {
  const theme = useTheme();

  let currDir = props.currDir;

  const openDeploymentModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "88%",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#eeebfb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    mt: 2,
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
    overflow: "auto",
    overflowX: "hidden",
  };

  const logStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
    overflow: "scroll",
  };

  const deploymentDeleteStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "38%",
    height: "27%",
    justifyContent: "center",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
  };

  const deploymentRollbackPreviousStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "45%",
    height: "23%",
    justifyContent: "center",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
  };

  const deploymentRollingRestartStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "55%",
    height: "23%",
    justifyContent: "center",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
  };

  const deploymentScaleStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "38%",
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
  };

  const [openDeployment, setOpenDeployment] = React.useState(false);

  const [selectedDeploymentReadyColor, setSelectedDeploymentReadyColor] =
    useState("");
  const [
    selectedDeploymentReadyColorLight,
    setSelectedDeploymentReadyColorLight,
  ] = useState("");

  const [openDeploymentLog, setOpenDeploymentLog] = React.useState(false);
  const [deploymentLogs, setDeploymentLogs] = React.useState([]);

  const [openDeploymentYaml, setOpenDeploymentYaml] = React.useState(false);
  const [deploymentYaml, setDeploymentYaml] = React.useState([]);

  const [openDeploymentDescribe, setOpenDeploymentDescribe] =
    React.useState(false);
  const [deploymentDescribe, setDeploymentDescribe] = React.useState([]);

  const [openDeploymentRolloutStatus, setOpenDeploymentRolloutStatus] =
    React.useState(false);
  const [deploymentRolloutStatus, setDeploymentRolloutStatus] = React.useState(
    []
  );

  const [openDeploymentRolloutHistory, setOpenDeploymentRolloutHistory] =
    React.useState(false);
  const [deploymentRolloutHistory, setDeploymentRolloutHistory] =
    React.useState([]);

  const [openDeploymentDelete, setOpenDeploymentDelete] = React.useState(false);

  const [openDeploymentRollbackPrevious, setOpenDeploymentRollbackPrevious] =
    React.useState(false);

  const [openDeploymentRollingRestart, setOpenDeploymentRollingRestart] =
    React.useState(false);

  const [openDeploymentScale, setOpenDeploymentScale] = React.useState(false);

  const [deploymentScaleNumber, setDeploymentScaleNumber] = React.useState(0);

  const [kubeSystemDeploymentsCheck, setKubeSystemDeploymentsCheck] =
    React.useState(false);
  const [kubeSystemDeployments, setKubeSystemDeployments] = React.useState([]);

  const [selectedDeployment, setSelectedDeployment] = useState([
    {
      index: "",
      name: "",
      available: "",
      age: "",
      containers: "",
      images: "",
      readyDenominator: "",
      readyNumerator: "",
      replicaSets: {},
      selector: "",
      upToDate: "",
    },
  ]);

  //Listen to "get deployments" return event and set pods array
  ipcRenderer.on("got_deployments", (event, arg) => {
    let argArr = arg.split("");

    let filteredDeployments = [];

    let i: number = 0;

    //skip row of column titles
    while (arg[i] !== "\n") {
      i++;
    }
    i++;

    for (let j = 0; i < argArr.length; i++) {
      let namespaceOutput: any = [];
      let nameOutput: any = [];
      let readyNumeratorOutput: any = [];
      let readyDenominatorOutput: any = [];
      let upToDateOutput: any = [];
      let availableOutput: any = [];
      let ageOutput: any = [];
      let containersOutput: any = [];
      let imagesOutput: any = [];
      let selectorOutput: any = [];

      //saves namespace
      while (arg[i] !== " ") {
        namespaceOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves name
      while (arg[i] !== " ") {
        nameOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves ready
      while (arg[i] !== "/") {
        readyNumeratorOutput.push(arg[i]);
        i++;
      }
      i++;
      while (arg[i] !== " ") {
        readyDenominatorOutput.push(arg[i]);
        i++;
      }

      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves up-to-date
      while (arg[i] !== " ") {
        upToDateOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves available
      while (arg[i] !== " ") {
        availableOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves age
      while (arg[i] !== " ") {
        ageOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves containers
      while (arg[i] !== " ") {
        containersOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves images
      while (arg[i] !== " ") {
        imagesOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves selector
      while (arg[i] !== "\n") {
        selectorOutput.push(arg[i]);
        i++;
      }

      let deployment = {
        index: j,
        namespace: namespaceOutput.join(""),
        name: nameOutput.join(""),
        readyNumerator: Number(readyNumeratorOutput.join("")),
        readyDenominator: Number(readyDenominatorOutput.join("")),
        upToDate: Number(upToDateOutput.join("")),
        available: Number(availableOutput.join("")),
        age: ageOutput.join(""),
        containers: containersOutput.join(""),
        images: imagesOutput.join(""),
        selector: selectorOutput.join(""),
        replicaSets: [],
      };

      filteredDeployments.push(deployment);
      j++;
    } //end of for loop parsing deployments return
    props.setDeploymentsArr(filteredDeployments);
  }); //--------------------------------------end of ipc to parse deployments --------

  //Listen to "get replicaSets" return event and set pods array
  ipcRenderer.on("got_rs", (event, arg) => {
    let argArr = arg.split("");

    let filteredReplicaSets = [];

    let i: number = 0;

    //skip row of column titles
    while (arg[i] !== "\n") {
      i++;
    }
    i++;

    for (let j = 0; i < argArr.length; i++) {
      let namespaceOutput: any = [];
      let nameOutput: any = [];
      let desiredOutput: any = [];
      let currentOutput: any = [];
      let readyOutput: any = [];
      let ageOutput: any = [];
      let containersOutput: any = [];
      let imagesOutput: any = [];
      let selectorOutput: any = [];

      //saves namespace
      while (arg[i] !== " ") {
        namespaceOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves name
      while (arg[i] !== " ") {
        nameOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves desired
      while (arg[i] !== " ") {
        desiredOutput.push(arg[i]);
        i++;
      }

      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves current
      while (arg[i] !== " ") {
        currentOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves available
      while (arg[i] !== " ") {
        readyOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves age
      while (arg[i] !== " ") {
        ageOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves containers
      while (arg[i] !== " ") {
        containersOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves images
      while (arg[i] !== " ") {
        imagesOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves selector
      while (arg[i] !== "\n") {
        selectorOutput.push(arg[i]);
        i++;
      }

      let replicaSet = {
        index: j,
        namespace: namespaceOutput.join(""),
        name: nameOutput.join(""),
        desired: desiredOutput.join(""),
        current: currentOutput.join(""),
        ready: readyOutput.join(""),
        age: ageOutput.join(""),
        containers: containersOutput.join(""),
        images: imagesOutput.join(""),
        selector: selectorOutput.join(""),
      };

      filteredReplicaSets.push(replicaSet);
      j++;
    } //end of for loop parsing replicaSets return

    //add each replicaSet to its deployment
    let tempDeploys = [...props.deploymentsArr];
    for (let i = 0; i < tempDeploys.length; i++) {
      tempDeploys[i]["replicaSets"] = filteredReplicaSets[i];
    }

    // //set new deployments Arr state, based on if kube system checkbox
    if (props.selectedNamespace !== "ALL") {
      //if false, separate out kube system pods and then set state
      let kubeDeployments = tempDeploys.filter(
        (deployment) => deployment.namespace !== props.selectedNamespace
      );
      setKubeSystemDeployments([...kubeDeployments]);

      let kubeFilteredDeployments = tempDeploys.filter(
        (deployment) => deployment.namespace === props.selectedNamespace
      );
      props.setDeploymentsArr([...kubeFilteredDeployments]);
    } else {
      //else if checkbox is true set deployments array with kube system as well
      props.setDeploymentsArr([...tempDeploys]);
    }
  }); //--------------------------------------end of ipc to parse replicaSets --------

  useEffect(() => {
    props.getDeploymentsInfo();
  }, []);

  const handleDeploymentOpen = (deployment) => {
    if (deployment["readyNumerator"] / deployment["readyDenominator"] === 1) {
      setSelectedDeploymentReadyColor("#2fc665");
      setSelectedDeploymentReadyColorLight("#2fc665");
    } else {
      setSelectedDeploymentReadyColor("rgba(210, 223, 61)");
      setSelectedDeploymentReadyColorLight("rgba(210, 223, 61)");
    }
    setSelectedDeployment([deployment]);

    setOpenDeployment(true);
  };

  const handleDeploymentClose = () => {
    setSelectedDeployment([
      {
        index: "",
        name: "",
        available: "",
        age: "",
        containers: "",
        images: "",
        readyDenominator: "",
        readyNumerator: "",
        replicaSets: {},
        selector: "",
        upToDate: "",
      },
    ]);
    setOpenDeployment(false);
  };

  const handleDeploymentLogOpen = (pod) => {
    ipcRenderer.on("deploymentLogsRetrieved", (event, arg) => {
      let argArr = arg.split("\n");
      let temp = "";
      let output = [];
      for (let i = 0; i < argArr.length; i++) {
        output.push(<p>{argArr[i]}</p>);
      }
      setDeploymentLogs([...output]);
    });

    let deploymentLogsCommand = `kubectl logs deployment/${selectedDeployment[0]["name"]}`;
    //send get pods o wide info commands
    ipcRenderer.send("deploymentLogs_command", {
      deploymentLogsCommand,
      currDir,
    });

    setOpenDeploymentLog(true);
  };

  const handleDeploymentLogClose = () => {
    setOpenDeploymentLog(false);
  };

  const handleDeploymentYamlOpen = (pod) => {
    ipcRenderer.on("deploymentYamlRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output = [];
      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      setDeploymentYaml(output);
    });

    let deploymentYamlCommand = `kubectl get deployment/${selectedDeployment[0]["name"]} -o yaml`;
    //send get deployments yaml command
    ipcRenderer.send("deploymentYaml_command", {
      deploymentYamlCommand,
      currDir,
    });

    setOpenDeploymentYaml(true);
  };

  const handleDeploymentYamlClose = () => {
    setOpenDeploymentYaml(false);
  };

  const handleDeploymentDescribeOpen = (pod) => {
    ipcRenderer.on("deploymentDescribeRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output = [];

      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      setDeploymentDescribe(output);
    });

    let deploymentDescribeCommand = `kubectl describe deployment/${selectedDeployment[0]["name"]}`;
    //send get deployment describe command
    ipcRenderer.send("deploymentDescribe_command", {
      deploymentDescribeCommand,
      currDir,
    });

    setOpenDeploymentDescribe(true);
  };

  const handleDeploymentDescribeClose = () => {
    setOpenDeploymentDescribe(false);
  };

  const handleDeploymentRolloutStatusOpen = (pod) => {
    ipcRenderer.on("deploymentRolloutStatusRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output = [];

      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      setDeploymentRolloutStatus(output);
    });

    let deploymentRolloutStatusCommand = `kubectl rollout status deployment/${selectedDeployment[0]["name"]}`;
    //send get deployment rollout status command
    ipcRenderer.send("deploymentRolloutStatus_command", {
      deploymentRolloutStatusCommand,
      currDir,
    });

    setOpenDeploymentRolloutStatus(true);
  };

  const handleDeploymentRolloutStatusClose = () => {
    setOpenDeploymentRolloutStatus(false);
  };

  const handleDeploymentRolloutHistoryOpen = (pod) => {
    ipcRenderer.on("deploymentRolloutHistoryRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output = [];
      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      setDeploymentRolloutHistory(output);
    });

    let deploymentRolloutHistoryCommand = `kubectl rollout history deployment/${selectedDeployment[0]["name"]}`;
    //send get deployment rollout history command
    ipcRenderer.send("deploymentRolloutHistory_command", {
      deploymentRolloutHistoryCommand,
      currDir,
    });

    setOpenDeploymentRolloutHistory(true);
  };

  const handleDeploymentRolloutHistoryClose = () => {
    setOpenDeploymentRolloutHistory(false);
  };

  const handleDeploymentDeleteOpen = (pod) => {
    setOpenDeploymentDelete(true);
  };

  const handleDeploymentDeleteClose = () => {
    setOpenDeploymentDelete(false);
  };

  const handleDeploymentDelete = () => {
    //listen for pods deleted
    ipcRenderer.on("deleted_deployment", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getDeploymentsInfo();

      setOpenDeploymentDelete(false);
      setOpenDeployment(false);
    });

    let deploymentDeleteCommand = `kubectl delete deployment/${selectedDeployment[0]["name"]}`;
    //send get delete pod command
    ipcRenderer.send("deleteDeployment_command", {
      deploymentDeleteCommand,
      currDir,
    });
  };

  const handleDeploymentRollbackPreviousOpen = (pod) => {
    setOpenDeploymentRollbackPrevious(true);
  };

  const handleDeploymentRollbackPreviousClose = () => {
    setOpenDeploymentRollbackPrevious(false);
  };

  const handleDeploymentRollbackPrevious = () => {
    //listen for pods deleted
    ipcRenderer.on("rolledBackPrevious_deployment", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getDeploymentsInfo();

      setOpenDeploymentRollbackPrevious(false);
      setOpenDeployment(false);
    });

    let deploymentRollbackPreviousCommand = `kubectl rollout undo deployment/${selectedDeployment[0]["name"]}`;
    //send get delete pod command
    ipcRenderer.send("rollbackPreviousDeployment_command", {
      deploymentRollbackPreviousCommand,
      currDir,
    });
  };

  const handleDeploymentRollingRestartOpen = (pod) => {
    setOpenDeploymentRollingRestart(true);
  };

  const handleDeploymentRollingRestartClose = () => {
    setOpenDeploymentRollingRestart(false);
  };

  const handleDeploymentRollingRestart = () => {
    //listen for pods deleted
    ipcRenderer.on("completedRollingRestart_deployment", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getDeploymentsInfo();

      setOpenDeploymentRollingRestart(false);
      setOpenDeployment(false);
    });

    let deploymentRollingRestartCommand = `kubectl rollout restart deployment/${selectedDeployment[0]["name"]}`;
    //send get delete pod command
    ipcRenderer.send("rollingRestartDeployment_command", {
      deploymentRollingRestartCommand,
      currDir,
    });
  };

  const handleDeploymentScaleOpen = (pod) => {
    setOpenDeploymentScale(true);
  };

  const handleDeploymentScaleClose = () => {
    setOpenDeploymentScale(false);
  };

  const handleDeploymentScale = () => {
    //listen for pods deleted
    ipcRenderer.on("scaled_deployment", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getDeploymentsInfo();

      setOpenDeploymentScale(false);
      setOpenDeployment(false);
    });

    let deploymentScaleCommand = `kubectl scale --replicas=${deploymentScaleNumber} deployment/${selectedDeployment[0]["name"]}`;
    //send get delete pod command
    ipcRenderer.send("scaleDeployment_command", {
      deploymentScaleCommand,
      currDir,
    });
  };

  const handleSetDeploymentScaleNumber = (e) => {
    setDeploymentScaleNumber(e.target.value);
  };

  function handleKubeSystemChangeDeployments() {
    //switch state of checkmark to turn on / off
    props.getDeploymentsInfo();
    setKubeSystemDeploymentsCheck(!kubeSystemDeploymentsCheck);

    //if checkmark state is true, desired outcome is to merge kube pods in and sort by index
    if (kubeSystemDeploymentsCheck === true) {
      let tempDeployments = [...props.deploymentsArr, ...kubeSystemDeployments];
      let finalTemp = tempDeployments.sort((a, b) => a.index - b.index);
      props.setDeploymentsArr([...finalTemp]);
    } else {
      //if removing kube pods, first set them in separate array for ability to re-merge later
      let kubeDeployments = props.deploymentsArr.filter(
        (deployment) => deployment.namespace === "kube-system"
      );
      setKubeSystemDeployments([...kubeDeployments]);
      //filter out kube system pods and set new deployments Arr
      let tempDeployments = props.deploymentsArr.filter(
        (deployment) => deployment.namespace !== "kube-system"
      );
      props.setDeploymentsArr([...tempDeployments]);
    }
  }

  let deploymentsList = [];
  for (let i = 0; i < props.deploymentsArr.length; i++) {
    let deploymentReadyColor;
    let deploymentReadyColorLight;

    if (
      props.deploymentsArr[i]["readyNumerator"] /
        props.deploymentsArr[i]["readyDenominator"] ===
      1
    ) {
      deploymentReadyColor = "#2fc665";
      deploymentReadyColorLight = "#2fc665";
    } else {
      deploymentReadyColor = "rgba(210, 223, 61)";
      deploymentReadyColorLight = "rgba(210, 223, 61)";
    }

    deploymentsList.push(
      <>
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Outfit",
            fontWeight: "400",
            fontSize: "17px",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            textAlign: "left",
            width: "auto",
            margin: "17px 50px 0 20px",
            padding: "0 0 0px 0",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "#8f85fb" : "#9075ea",
            textShadow:
              theme.palette.mode === "dark"
                ? "1px 1px 2px black"
                : "1px 1px 1px #00000000",
            userSelect: "none",
          }}
        >
          DEPLOYMENT {i + 1}
          <Button
            key={i}
            id="podButt"
            onClick={() => handleDeploymentOpen(props.deploymentsArr[i])}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "450px",
              height: "105px",
              fontSize: "16px",
              justifyContent: "flex-start",
              textAlign: "left",
              alignItems: "space-between",
              margin: "2px 0 0 0",
              padding: "15px 0px 0px 0px",
              color: theme.palette.mode === "dark" ? "white" : "grey",
              border:
                theme.palette.mode === "dark"
                  ? "1.3px solid white"
                  : "1.3px solid #00000025",
              borderRadius: "5px",
              boxShadow:
                theme.palette.mode === "dark" ? "10px 9px 2px #00000060" : "",
              background:
                theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb80",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "440px",
                justifyContent: "flex-start",
              }}
            >
              <img
                style={{
                  width: "40px",
                  marginRight: "0px",
                  marginLeft: "10.8px",
                }}
                src="./deploy-2.svg"
              ></img>
              <span
                style={{
                  margin: "-2px 0 0 15px",
                  width: "360px",
                  lineHeight: "23px",
                  fontSize: "18px",
                  textTransform: "none",
                }}
              >
                {props.deploymentsArr[i]["name"]}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                  alignItems: "flex-end",
                  justifyContent: "right",
                  margin: "0px 10px 0 10px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "15px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? deploymentReadyColor
                        : deploymentReadyColorLight,
                    justifyContent: "right",
                  }}
                ></div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "12px",
                marginLeft: "70px",
                justifyContent: "space-around",
                alignItems: "start",
                width: "380px",
                height: "40px",
                marginTop: "0px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  textTransform: "none",
                  margin: "0 20px 0 0px",
                }}
              >
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: "500",
                    margin: "-6px 0 0px 0",
                  }}
                >
                  {props.deploymentsArr[i]["age"].toUpperCase()}
                </div>
                <div style={{ fontSize: "10px", margin: "-4px 0 0 0" }}>
                  AGE
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  textTransform: "none",
                  margin: "0 25px 0 20px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    margin: "-8.9px 0 0px -10px",
                    fontWeight: "500",
                  }}
                >
                  {props.deploymentsArr[i]["upToDate"]}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    margin: "-6px 0 0 0",
                    width: "70px",
                  }}
                >
                  UP-TO-DATE
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  textTransform: "none",
                  margin: "0 20px 0 15px",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "500",
                    margin: "-8.9px 0 0px 0",
                  }}
                >
                  {props.deploymentsArr[i]["available"]}
                </div>
                <div style={{ fontSize: "10px", margin: "-6px 0 0 0" }}>
                  AVAILABLE
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textTransform: "none",
                  margin: "-17px 0px 0 20px",
                  fontSize: "30px",
                  fontWeight: "400",
                  color:
                    theme.palette.mode === "dark"
                      ? deploymentReadyColor
                      : deploymentReadyColorLight,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    fontFamily: "Roboto Condensed",
                    fontWeight: "500",
                  }}
                >
                  {props.deploymentsArr[i]["readyNumerator"]}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "17px 0px 0 3px",
                      fontSize: "10px",
                      fontFamily: "Roboto",
                      fontWeight: "400",
                    }}
                  >
                    OF
                  </div>
                  <div style={{ margin: "0px 0 0 3px" }}>
                    {props.deploymentsArr[i]["readyDenominator"]}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "500",
                    margin: "-12.5px 0px 0 1px",
                  }}
                >
                  READY
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  fontSize: "10px",
                  margin: "0px 0 0 20px",
                }}
              ></div>
            </div>
          </Button>
        </div>
      </>
    );
  }

  let deploymentsListDiv;
  deploymentsListDiv = (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "-9px 0 0 68px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontFamily: "Outfit",
              fontSize: "24px",
              fontWeight: "900",
              letterSpacing: "2.8px",
              textAlign: "left",
              paddingTop: "0px",
              color: theme.palette.mode === "dark" ? "" : "#6d6fb4",
              userSelect: "none",
            }}
          >
            DEPLOYMENTS
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "13px 0 0 8px",
              fontSize: "12px",
              userSelect: "none",
            }}
          >
            ( {props.deploymentsArr.length} total )
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          margin: "-1px 0 0 68px",
          width: "171%",
        }}
      >
        <div
          style={{
            height: "1px",
            width: "70%",
            backgroundColor:
              theme.palette.mode === "dark" ? "#ffffff99" : "#6d6fb4",
            marginTop: "-1px",
          }}
        ></div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "5px -10px 0 0px",
        }}
      >
        <div style={{ display: "flex" }}> </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          margin: "5px 0 0 50px",
          width: "1200px",
        }}
      >
        {deploymentsList}
        <Modal
          open={openDeployment}
          onClose={handleDeploymentClose}
          style={{ overflow: "scroll", height: "100%" }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={openDeploymentModalStyle}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div style={{ width: "140px", height: "400px" }}>
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "15px 25px 0 15px",
                    }}
                    src="./deploy-2.svg"
                  ></img>
                </div>
                {"  "}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "820px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "38px",
                        fontWeight: "800",
                        letterSpacing: ".1px",
                        lineHeight: "40px",
                        margin: "30px 0 0 0",
                        padding: "00px -10px 10px 10px",
                        width: "790px",
                      }}
                    >
                      {selectedDeployment[0]["name"]}
                    </div>
                    <div
                      style={{
                        width: "17px",
                        height: "17px",
                        borderRadius: "20px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? selectedDeploymentReadyColor
                            : selectedDeploymentReadyColorLight,
                        justifyContent: "right",
                        margin: "4px 0 0px 10px",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                      fontWeight: "500",
                      margin: "20px 0 0 0",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        textTransform: "none",
                        margin: "-8px 70px 0 90px",
                        transform: "scale(2,2)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "19px",
                          fontWeight: "300",
                          margin: "-5px 0 0px 0",
                        }}
                      >
                        {selectedDeployment[0]["age"].toUpperCase()}
                      </div>
                      <div style={{ fontSize: "10px", margin: "-4px 0 0 0" }}>
                        AGE
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        textTransform: "none",
                        margin: "0 45px 0 80px",
                        transform: "scale(2,2)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "22px",
                          fontWeight: "300",
                          margin: "-8.9px 0 0px -10px",
                        }}
                      >
                        {selectedDeployment[0]["upToDate"]}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          margin: "-6px 0 0 0",
                          width: "70px",
                        }}
                      >
                        UP-TO-DATE
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        textTransform: "none",
                        margin: "0 70px 0 85px",
                        transform: "scale(2,2)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "22px",
                          fontWeight: "300",
                          margin: "-8.9px 0 0px 0",
                        }}
                      >
                        {selectedDeployment[0]["available"]}
                      </div>
                      <div style={{ fontSize: "10px", margin: "-6px 0 0 0" }}>
                        AVAILABLE
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        textTransform: "none",
                        margin: "45px 0px 0 70px",
                        fontSize: "30px",
                        fontWeight: "400",
                        color:
                          theme.palette.mode === "dark"
                            ? selectedDeploymentReadyColor
                            : selectedDeploymentReadyColorLight,
                        transform: "scale(2,2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          fontFamily: "Roboto Condensed",
                          fontWeight: "200",
                          margin: "-16px 0px 0 0px",
                        }}
                      >
                        {selectedDeployment[0]["readyNumerator"]}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            margin: "17px 0px 0 3px",
                            fontSize: "9px",
                            fontFamily: "Roboto",
                            fontWeight: "400",
                          }}
                        >
                          OF
                        </div>
                        <div style={{ margin: "0px 0 0 3px" }}>
                          {selectedDeployment[0]["readyDenominator"]}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: "500",
                          margin: "-12.5px 0px 0 1px",
                        }}
                      >
                        READY
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      fontWeight: "800",
                      margin: "50px 0 0 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "0 0 0 10px",
                        fontSize: "16px",
                        color:
                          theme.palette.mode === "dark"
                            ? "#ffffff99"
                            : "darkpurple",
                        userSelect: "none",
                      }}
                    >
                      {" "}
                      NAMESPACE:
                      <br />
                      CONTAINERS:
                      <br />
                      IMAGES:
                      <br />
                      SELECTOR:
                      <br />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "0 0 0 10px",
                        lineHeight: "24.3px",
                        fontSize: "13.5px",
                      }}
                    >
                      {selectedDeployment[0]["namespace"]}
                      <br />
                      {selectedDeployment[0]["containers"]}
                      <br />
                      {selectedDeployment[0]["images"]}
                      <br />
                      {selectedDeployment[0]["selector"]}
                    </div>
                  </div>
                  <div
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      margin: "40px 0 0px 0px",
                      fontSize: "10px",
                    }}
                  >
                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentLogOpen}
                      style={{ margin: "0 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        VIEW DEPLOYMENT LOGS
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentLog}
                      onClose={handleDeploymentLogClose}
                    >
                      <Box sx={logStyle}>
                        <div
                          style={{
                            fontFamily: "Outfit",
                            fontSize: "24px",
                            fontWeight: "700",
                            textAlign: "center",
                            marginTop: "10px",
                          }}
                        >
                          DEPLOYMENT LOGS
                        </div>
                        {deploymentLogs}
                      </Box>
                    </Modal>
                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentYamlOpen}
                      style={{ margin: "0 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        VIEW DEPLOYMENT YAML
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentYaml}
                      onClose={handleDeploymentYamlClose}
                    >
                      <Box sx={logStyle}>
                        <div
                          style={{
                            fontFamily: "Outfit",
                            fontSize: "24px",
                            fontWeight: "700",
                            textAlign: "center",
                            marginTop: "10px",
                          }}
                        >
                          DEPLOYMENT YAML
                        </div>
                        {deploymentYaml}
                      </Box>
                    </Modal>

                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentDescribeOpen}
                      style={{ margin: "0 10px 20px 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        DESCRIBE DEPLOYMENT
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentDescribe}
                      onClose={handleDeploymentDescribeClose}
                    >
                      <Box sx={logStyle}>
                        <div
                          style={{
                            fontFamily: "Outfit",
                            fontSize: "24px",
                            fontWeight: "700",
                            textAlign: "center",
                            marginTop: "10px",
                          }}
                        >
                          DEPLOYMENT DESCRIBE
                        </div>
                        {deploymentDescribe}
                      </Box>
                    </Modal>

                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentRolloutStatusOpen}
                      style={{ margin: "0 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        VIEW ROLLOUT STATUS
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentRolloutStatus}
                      onClose={handleDeploymentRolloutStatusClose}
                    >
                      <Box sx={logStyle}>
                        <div
                          style={{
                            fontFamily: "Outfit",
                            fontSize: "24px",
                            fontWeight: "700",
                            textAlign: "center",
                            marginTop: "10px",
                          }}
                        >
                          DEPLOYMENT ROLLOUT STATUS
                        </div>
                        {deploymentRolloutStatus}
                      </Box>
                    </Modal>

                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentRolloutHistoryOpen}
                      style={{ margin: "0 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        VIEW ROLLOUT HISTORY
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentRolloutHistory}
                      onClose={handleDeploymentRolloutHistoryClose}
                    >
                      <Box sx={logStyle}>
                        <div
                          style={{
                            fontFamily: "Outfit",
                            fontSize: "24px",
                            fontWeight: "700",
                            textAlign: "center",
                            marginTop: "10px",
                          }}
                        >
                          DEPLOYMENT ROLLOUT HISTORY
                        </div>
                        {deploymentRolloutHistory}
                      </Box>
                    </Modal>

                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentRollbackPreviousOpen}
                      style={{ margin: "0 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        ROLLBACK TO PREV. VERSION
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentRollbackPrevious}
                      onClose={handleDeploymentDeleteClose}
                      style={{ overflow: "scroll", height: "100%" }}
                    >
                      <Box sx={deploymentRollbackPreviousStyle}>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "900",
                            paddingTop: "20px",
                          }}
                        >
                          ARE YOU SURE YOU WANT TO ROLLBACK?
                        </div>
                        <div
                          style={{
                            padding: "10px 40px 0 40px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        >
                          Please note: This will rollback this deployment to the
                          previous version.
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "30px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentRollbackPrevious}
                            style={{ marginRight: "10px" }}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "300px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 51%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              ROLLBACK TO PREVIOUS VERSION
                            </span>
                          </button>

                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentRollbackPreviousClose}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 20%) 0%, hsl(239, 40%, 25%) 8%, hsl(239, 40%, 25%) 92%,  hsl(239, 40%, 20%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "110px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 31%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              CANCEL
                            </span>
                          </button>
                        </div>
                      </Box>
                    </Modal>

                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentRollingRestartOpen}
                      style={{ margin: "0 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        PERFORM ROLLING RESTART
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentRollingRestart}
                      onClose={handleDeploymentRollingRestartClose}
                      style={{ overflow: "scroll", height: "100%" }}
                    >
                      <Box sx={deploymentRollingRestartStyle}>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "900",
                            paddingTop: "20px",
                          }}
                        >
                          ARE YOU SURE YOU WANT TO PERFORM ROLLING RESTART?
                        </div>
                        <div
                          style={{
                            padding: "10px 40px 0 40px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        >
                          Please note: This will safely stop all your pods
                          before restarting the deployment.
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "30px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentRollingRestart}
                            style={{ marginRight: "10px" }}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "300px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 51%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              PERFORM ROLLING RESTART
                            </span>
                          </button>

                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentRollingRestartClose}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 20%) 0%, hsl(239, 40%, 25%) 8%, hsl(239, 40%, 25%) 92%,  hsl(239, 40%, 20%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "110px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 31%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              CANCEL
                            </span>
                          </button>
                        </div>
                      </Box>
                    </Modal>

                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentScaleOpen}
                      style={{ margin: "0 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        SCALE DEPLOYMENT
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentScale}
                      onClose={handleDeploymentScaleClose}
                      style={{ overflow: "scroll", height: "100%" }}
                    >
                      <Box sx={deploymentScaleStyle}>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "900",
                            paddingTop: "20px",
                          }}
                        >
                          SCALE YOUR DEPLOYMENT
                        </div>
                        <div
                          style={{
                            padding: "10px 40px 0 40px",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        >
                          Please select the new number to scale your
                          deployment's replicas to.
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            margin: "10px 0 10px 0",
                          }}
                        >
                          CURRENT REPLICAS IS:{" "}
                          {selectedDeployment[0]["available"]}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          {" "}
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "900",
                              padding: "25px 10px 0 0px",
                            }}
                          >
                            SCALE TO:
                          </div>{" "}
                          <TextField
                            onChange={(e) => handleSetDeploymentScaleNumber(e)}
                            inputProps={{
                              inputMode: "numeric",
                              min: 1,
                              pattern: "[0-9]*",
                              placeholder: `${selectedDeployment[0]["available"]}`,
                            }}
                            type="number"
                            style={{ width: "60px", margin: "10px 0 0 0px" }}
                          ></TextField>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "30px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentScale}
                            style={{ marginRight: "10px" }}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "220px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 51%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              SCALE DEPLOYMENT
                            </span>
                          </button>

                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentScaleClose}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 20%) 0%, hsl(239, 40%, 25%) 8%, hsl(239, 40%, 25%) 92%,  hsl(239, 40%, 20%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "110px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 31%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              CANCEL
                            </span>
                          </button>
                        </div>
                      </Box>
                    </Modal>

                    <button
                      className="button3D-pushable"
                      role="button"
                      onClick={handleDeploymentDeleteOpen}
                      style={{ margin: "20px 10px 0 0px" }}
                    >
                      <span className="button3D-shadow"></span>
                      <span
                        className="button3D-edge"
                        style={{
                          background:
                            theme.palette.mode === "dark"
                              ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                              : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                        }}
                      ></span>
                      <span
                        className="button3D-front text"
                        style={{
                          fontSize: "12.5px",
                          width: "250px",
                          background:
                            theme.palette.mode === "dark"
                              ? "hsl(239, 38%, 51%)"
                              : "hsl(263, 65%, 80%)",
                        }}
                      >
                        DELETE DEPLOYMENT
                      </span>
                    </button>
                    <Modal
                      open={openDeploymentDelete}
                      onClose={handleDeploymentDeleteClose}
                      style={{ overflow: "scroll", height: "100%" }}
                    >
                      <Box sx={deploymentDeleteStyle}>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "900",
                            paddingTop: "20px",
                          }}
                        >
                          ARE YOU SURE YOU WANT DELETE?
                        </div>
                        <div
                          style={{
                            padding: "10px 40px 0 40px",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        >
                          WARNING: Deleting this depoyment will stop and delete
                          it immediately. This may cause other pods or functions
                          to stop working.
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "30px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentDelete}
                            style={{ marginRight: "10px" }}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 25%) 0%, hsl(239, 40%, 30%) 8%, hsl(239, 40%, 30%) 92%,  hsl(239, 40%, 25%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "220px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 51%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              DELETE DEPLOYMENT
                            </span>
                          </button>

                          <button
                            className="button3D-pushable"
                            role="button"
                            onClick={handleDeploymentDeleteClose}
                          >
                            <span className="button3D-shadow"></span>
                            <span
                              className="button3D-edge"
                              style={{
                                background:
                                  theme.palette.mode === "dark"
                                    ? "linear-gradient(to left, hsl(239, 40%, 20%) 0%, hsl(239, 40%, 25%) 8%, hsl(239, 40%, 25%) 92%,  hsl(239, 40%, 20%) 100%)"
                                    : "linear-gradient(to left, hsl(263, 40%, 64%) 0%, hsl(263, 40%, 70%) 8%, hsl(263, 40%, 70%) 92%,hsl(263, 40%, 64%) 100%)",
                              }}
                            ></span>
                            <span
                              className="button3D-front text"
                              style={{
                                width: "110px",
                                background:
                                  theme.palette.mode === "dark"
                                    ? "hsl(239, 38%, 31%)"
                                    : "hsl(263, 65%, 80%)",
                              }}
                            >
                              CANCEL
                            </span>
                          </button>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  margin: "20px 0 0 140px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Outfit",
                    fontSize: "20px",
                    fontWeight: "900",
                    letterSpacing: "3px",
                    textAlign: "left",
                    paddingTop: "10px",
                    userSelect: "none",
                  }}
                >
                  REPLICA SETS
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  margin: "0 0 0 140px",
                }}
              >
                <div
                  style={{
                    height: "1px",
                    width: "100%",
                    backgroundColor: "#ffffff99",
                    marginRight: "20px",
                    marginTop: "5px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  margin: "10px 0 0 140px",
                }}
              >
                <img
                  style={{
                    width: "50px",
                    margin: "10px 0 0 0",
                  }}
                  src="./rs.svg"
                ></img>
                <span
                  style={{
                    margin: "16px 0 0 15px",
                    width: "385px",
                    lineHeight: "23px",
                    fontSize: "18px",
                    textTransform: "none",
                  }}
                >
                  {selectedDeployment[0]["replicaSets"]["name"]}
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    margin: "10px 0 0 0px",
                    height: "60px",
                    width: "85px",
                    lineHeight: "23px",
                    fontSize: "26px",
                    textTransform: "none",
                    fontWeight: "300",
                  }}
                >
                  <div>{selectedDeployment[0]["replicaSets"]["desired"]}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "400",
                    }}
                  >
                    DESIRED
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    margin: "10px 0 0 0px",
                    height: "60px",
                    width: "85px",
                    lineHeight: "23px",
                    fontSize: "26px",
                    textTransform: "none",
                    fontWeight: "300",
                  }}
                >
                  <div>{selectedDeployment[0]["replicaSets"]["current"]}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "400",
                    }}
                  >
                    CURRENT
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    margin: "10px 0 0 0px",
                    height: "60px",
                    width: "85px",
                    lineHeight: "23px",
                    fontSize: "26px",
                    textTransform: "none",
                    fontWeight: "300",
                  }}
                >
                  <div>{selectedDeployment[0]["replicaSets"]["ready"]}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "400",
                    }}
                  >
                    READY
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    margin: "10px 0 0 0px",
                    height: "60px",
                    width: "85px",
                    lineHeight: "23px",
                    fontSize: "22px",
                    textTransform: "none",
                    fontWeight: "300",
                  }}
                >
                  <div>{selectedDeployment[0]["replicaSets"]["age"]}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "400",
                    }}
                  >
                    AGE
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );

  return (
    <>
      {/* ----------------MAIN CONTENT---------------- */}

      <div
        data-height="100%"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflow: "hidden",
          alignItems: "flex-start",
          marginLeft: "0px",
          marginTop: "-17px",
          marginBottom: "50px",
          textAlign: "center",
          width: "95.5%",
          height: "auto",
        }}
      >
        <div>{deploymentsListDiv}</div>
      </div>
    </>
  );
}

export default KraneDeploymentsList;
