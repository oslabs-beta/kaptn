import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, useTheme, Box, Modal } from "@mui/material";
const { ipcRenderer } = require("electron");
import SideNav from "../components/Sidebar.js";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { JsxElement } from "typescript";
import KraneNodeList from "../components/KraneNodeList.js";
import KranePodList from "../components/KranePodList.js";
import KraneDeploymentsList from "../components/KraneDeploymentsList";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
    color: "white",
    fontSize: 11,
  },
}));

type ArrPodObjs = {
  name: string;
  ready: string;
  status: string;
  restarts: string;
  lastRestart: string;
  age: string;
  CpuPercent: number;
  memoryPercent: number;
};

let filteredPods: any = [];

function Krane() {
  const [namespacesArr, setNamespacesArr] = useState(["ALL"]);
  const [namespaceIndex, setNamespaceIndex] = useState(0);
  const [selectedNamespace, setSelectedNamespace] = useState(
    namespacesArr[namespaceIndex]
  );

  const [refreshSpeed, setRefreshSpeed] = useState(10);

  const [deploymentsArr, setDeploymentsArr] = useState([]);
  const [podsArr, setPodsArr] = useState([]);
  const [allPodsArr, setAllPodsArr] = useState([]);
  const [nodesArr, setNodesArr] = useState([]);
  const [podsContainersArr, setPodsContainersArr] = useState([]);
  const [currDir, setCurrDir] = useState("NONE SELECTED");

  const [openPod, setOpenPod] = React.useState(false);

  const [openPodLog, setOpenPodLog] = React.useState(false);
  const [podLogs, setPodLogs] = React.useState([]);

  const [openPodYaml, setOpenPodYaml] = React.useState(false);
  const [podYaml, setPodYaml] = React.useState([]);

  const [openPodDescribe, setOpenPodDescribe] = React.useState(false);
  const [podDescribe, setPodDescribe] = React.useState([]);

  const [openPodDelete, setOpenPodDelete] = React.useState(false);

  const [selectedPodStatusColor, setSelectedPodStatusColor] = useState("");
  const [selectedPodStatusColorLight, setSelectedPodStatusColorLight] =
    useState("");
  const [selectedPodCPUColor, setSelectedPodCPUColor] = useState("");
  const [selectedPodCPUColorLight, setSelectedPodCPUColorLight] = useState("");
  const [selectedPodMemoryColor, setSelectedPodMemoryColor] = useState("");
  const [selectedPodMemoryColorLight, setSelectedPodMemoryColorLight] =
    useState("");
  const [selectedPod, setSelectedPod] = useState([
    {
      index: "",
      name: "",
      ready: "",
      status: "",
      restarts: "",
      lastRestart: "",
      age: "",
      podCpuUsed: "",
      podCpuLimit: "",
      podCpuPercent: "",
      podMemoryUsed: "",
      podMemoryLimit: "",
      podMemoryPercent: "",
      ipAddress: "",
      node: "",
      nominatedNode: "",
      readinessGates: "",
      podContainers: [],
    },
  ]);

  const theme = useTheme();

  ipcRenderer.on("got_namespaces", (event, arg) => {
    let argArr = arg.split("");

    let namespaceArrayOutput = [];

    let i: number = 0;

    //skip row of column titles
    while (arg[i] !== "\n") {
      i++;
    }
    i++;

    for (let j = 0; i < argArr.length; i++) {
      let namespaceOutput: any = [];

      //saves namespace
      while (arg[i] !== " ") {
        namespaceOutput.push(arg[i]);
        i++;
      }
      let output = namespaceOutput.join("");
      let prevNamespaces = [...namespacesArr];
      namespaceArrayOutput.push(output);
      //skips spaces
      while (arg[i] !== "\n") {
        i++;
      }
    }

     //for each namespace, create an array with MenuItems JSX for mui select component, starting with an "ALL" option first.
    let finalOutput = [];
    finalOutput.push(
      <MenuItem
        value={"ALL"}
        style={{
          color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
          backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "white",
          fontSize: "12px",
        }}
        sx={{bg:theme.palette.mode === "dark" ? "#5c4d9a" : "white",}}
      >
        ALL
      </MenuItem>
    );

    for (let k = 0; k < namespaceArrayOutput.length; k++) {
      finalOutput.push(
        <MenuItem
          value={`${namespaceArrayOutput[k]}`}
          style={{
            color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
          }}
          sx={{bg:theme.palette.mode === "dark" ? "#5c4d9a" : "white",}}
        >
          {namespaceArrayOutput[k]}
        </MenuItem>
      );
    }

    setNamespacesArr(finalOutput);
  });

  // ----------------------------------------- get pods info section ------------

  function handleClick(event) {
    // setDeploymentsArr([]);
    // setNodesArr([]);
    // setPodsArr([]);
    getPodsAndContainers();
    getNodesInfo();
    getDeploymentsInfo();
  }

  function handleChangeRefreshSpeed(event) {
    clearInterval(intervalArray[0]);
    setIntervalArray([]);

    // let newRefreshIndex = refreshArray.indexOf(refreshSpeed);
    // newRefreshIndex = ++newRefreshIndex % 4;
    // setRefreshSpeed(refreshArray[newRefreshIndex]);

    setRefreshSpeed(event.target.value);

    const allInterval = setInterval(() => {
      getPodsAndContainers();
      getNodesInfo();
      getDeploymentsInfo();
    }, event.target.value * 1000);

    setIntervalArray([allInterval]);

    // const allInterval = setInterval(() => {
    //   getDeploymentsInfo();
    //   getNodesInfo();
    //   getPodsAndContainers();
    // }, refreshArray[newRefreshIndex] * 1000);

    // return () => {
    //   clearInterval(allInterval);
    // };
  }

  // the below choose kube config function is incorrect ... to use custom kubeconfig location, it will require passing the following flag to all commands: --kubeconfig="path/to/kubeconfigfile
  // ... suggest creating state called customConfigPath and customConfigStatus ... if status is true, it passes customConfigPath in and adds whole statement to end of each command (with variable that is otherwise assigned value of "" to make it pass nothing and not affect commands unless altered via function below).
  const handleChooseKubeConfig = (event) => {
    let path = event.target.files[0].path.split("");
    while (path[path.length - 1] !== "/") {
      path.pop();
    }
    let absPath = path.join("");
    setCurrDir(absPath);
  };

  const [deploymentsShowStatus, setDeploymentsShowStatus] = useState(false);

  function handleDeploymentsShowStatus() {
    clearInterval(intervalArray[0]);
    setIntervalArray([]);
    setNodeShowStatus(false);
    setDeploymentsShowStatus(!deploymentsShowStatus);

    const allInterval = setInterval(() => {
      getPodsAndContainers();
      getNodesInfo();
      getDeploymentsInfo();
    }, refreshSpeed * 1000);

    setIntervalArray([allInterval]);
  }

  function getDeploymentsInfo() {
    let deploymentsCommand: string =
      "kubectl get deployments -o wide --all-namespaces";
    //send krane command to get all nodes
    ipcRenderer.send("getDeployments_command", {
      deploymentsCommand,
      currDir,
    });

    let getReplicasCommand: string = `kubectl get rs -o wide --all-namespaces`;
    setTimeout(() => {
      ipcRenderer.send("getReplicas_command", {
        getReplicasCommand,
        currDir,
      });
    }, 5);
  }

  const [nodeShowStatus, setNodeShowStatus] = useState(false);
  const [intervalArray, setIntervalArray] = useState([]);

  function handleNodeShowStatus() {
    clearInterval(intervalArray[0]);
    setIntervalArray([]);

    setDeploymentsShowStatus(false);
    setNodeShowStatus(!nodeShowStatus);

    const allInterval = setInterval(() => {
      getPodsAndContainers();
      getNodesInfo();
      getDeploymentsInfo();
    }, refreshSpeed * 1000);

    setIntervalArray([allInterval]);

    // return () => {
    //   clearInterval(allInterval);
    // };
  }

  function getPodsAndContainers() {
    let podsCommand = "kubectl get pods --all-namespaces -o wide";
    //send get pods o wide info commands
    ipcRenderer.send("getPods_command", {
      podsCommand,
      currDir,
    });

    //---------------------------------------- beginnging get all pods cpu and memory usage section -
    let CpuUsedCommand = `kubectl top pods --all-namespaces`;
    setTimeout(() => {
      ipcRenderer.send("getCpuUsed_command", {
        CpuUsedCommand,
        currDir,
      });
    }, 250);

    // ----------------------------------------------- Beginning of get pod cpu and memory limits section

    let cpuLimitsCommand = `kubectl get po --all-namespaces -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu",Memory-limit:"spec.containers[*].resources.limits.memory"`;
    setTimeout(() => {
      ipcRenderer.send("getCpuLimits_command", {
        cpuLimitsCommand,
        currDir,
      });
    }, 400);

    // send command to get selected pods containers info
    let podContainersCommand = `kubectl top pod --containers --all-namespaces`;
    //send get pods o wide info commands
    setTimeout(() => {
      ipcRenderer.send("podContainers_command", {
        podContainersCommand,
        currDir,
      });
    }, 450);
  }

  function getNodesInfo() {
    let kraneCommand: string = "kubectl get nodes -o wide";
    //send krane command to get all nodes
    ipcRenderer.send("getNodes_command", {
      kraneCommand,
      currDir,
    });

    //---------------------------------------- get all nodes cpu and memory usage -
    let nodesCpuUsedCommand: string = `kubectl top nodes`;
    setTimeout(() => {
      ipcRenderer.send("getNodesCpuUsed_command", {
        nodesCpuUsedCommand,
        currDir,
      });
    }, 50);

    let nodesCpuLimitsCommand: string = `kubectl get nodes -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu,Memory-limit:spec.containers[*].resources.limits.cpu"`;
    setTimeout(() => {
      ipcRenderer.send("getNodesCpuLimits_command", {
        nodesCpuLimitsCommand,
        currDir,
      });
    }, 100);
  }

  function getNamespaces() {
    let namespacesCommand: string = "kubectl get ns";
    //send krane command to get all nodes
    ipcRenderer.send("getNamespaces_command", {
      namespacesCommand,
      currDir,
    });
  }

  useEffect(() => {
    getNamespaces();
  }, []);

  function handleNamespaceChange(event) {
    setSelectedNamespace(event.target.value);
    handleClick(null);
  }

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let deploymentsDiv;
  if (deploymentsShowStatus) {
    deploymentsDiv = (
      <>
        <KraneDeploymentsList
          selectedNamespace={selectedNamespace}
          getDeploymentsInfo={getDeploymentsInfo}
          deploymentsArr={deploymentsArr}
          setDeploymentsArr={setDeploymentsArr}
        />
      </>
    );
  }

  let nodesAndPodsDiv;
  if (nodeShowStatus) {
    nodesAndPodsDiv = (
      <>
        <KraneNodeList
          nodesArr={nodesArr}
          setNodesArr={setNodesArr}
          podsArr={podsArr}
          setPodsArr={setPodsArr}
          allPodsArr={allPodsArr}
          setAllPodsArr={setAllPodsArr}
          podsContainersArr={podsContainersArr}
          setPodsContainersArr={setPodsContainersArr}
          getNodesInfo={getNodesInfo}
          openPod={openPod}
          setOpenPod={setOpenPod}
          openPodDelete={openPodDelete}
          setOpenPodDelete={setOpenPodDelete}
          openPodLog={openPodLog}
          setOpenPodLog={setOpenPodLog}
          podLogs={podLogs}
          setPodLogs={setPodLogs}
          openPodYaml={openPodYaml}
          setOpenPodYaml={setOpenPodYaml}
          podYaml={podYaml}
          setPodYaml={setPodYaml}
          openPodDescribe={openPodDescribe}
          setOpenPodDescribe={setOpenPodDescribe}
          podDescribe={podDescribe}
          setPodDescribe={setPodDescribe}
          selectedPodStatusColor={selectedPodStatusColor}
          setSelectedPodStatusColor={setSelectedPodStatusColor}
          selectedPodCPUColor={selectedPodCPUColor}
          setSelectedPodCPUColor={setSelectedPodCPUColor}
          selectedPodMemoryColor={selectedPodMemoryColor}
          setSelectedPodMemoryColor={setSelectedPodMemoryColor}
          selectedPodStatusColorLight={selectedPodStatusColorLight}
          setSelectedPodStatusColorLight={setSelectedPodStatusColorLight}
          selectedPodCPUColorLight={selectedPodCPUColorLight}
          setSelectedPodCPUColorLight={setSelectedPodCPUColorLight}
          selectedPodMemoryColorLight={selectedPodMemoryColorLight}
          setSelectedPodMemoryColorLight={setSelectedPodMemoryColorLight}
          selectedPod={selectedPod}
          setSelectedPod={setSelectedPod}
        />
        <KranePodList
          selectedNamespace={selectedNamespace}
          podsArr={podsArr}
          setPodsArr={setPodsArr}
          allPodsArr={allPodsArr}
          setAllPodsArr={setAllPodsArr}
          getPodsAndContainers={getPodsAndContainers}
          currDir={currDir}
          setCurrDir={setCurrDir}
          podsContainersArr={podsContainersArr}
          setPodsContainersArr={setPodsContainersArr}
          openPod={openPod}
          setOpenPod={setOpenPod}
          openPodDelete={openPodDelete}
          setOpenPodDelete={setOpenPodDelete}
          openPodLog={openPodLog}
          setOpenPodLog={setOpenPodLog}
          podLogs={podLogs}
          setPodLogs={setPodLogs}
          openPodYaml={openPodYaml}
          setOpenPodYaml={setOpenPodYaml}
          podYaml={podYaml}
          setPodYaml={setPodYaml}
          openPodDescribe={openPodDescribe}
          setOpenPodDescribe={setOpenPodDescribe}
          podDescribe={podDescribe}
          setPodDescribe={setPodDescribe}
          selectedPodStatusColor={selectedPodStatusColor}
          setSelectedPodStatusColor={setSelectedPodStatusColor}
          selectedPodCPUColor={selectedPodCPUColor}
          setSelectedPodCPUColor={setSelectedPodCPUColor}
          selectedPodMemoryColor={selectedPodMemoryColor}
          setSelectedPodMemoryColor={setSelectedPodMemoryColor}
          selectedPodStatusColorLight={selectedPodStatusColorLight}
          setSelectedPodStatusColorLight={setSelectedPodStatusColorLight}
          selectedPodCPUColorLight={selectedPodCPUColorLight}
          setSelectedPodCPUColorLight={setSelectedPodCPUColorLight}
          selectedPodMemoryColorLight={selectedPodMemoryColorLight}
          setSelectedPodMemoryColorLight={setSelectedPodMemoryColorLight}
          selectedPod={selectedPod}
          setSelectedPod={setSelectedPod}
        />
      </>
    );
  }

  let refreshShowDiv;
  let noneChosenDiv;
  if (nodeShowStatus || deploymentsShowStatus) {
    refreshShowDiv = (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "91%",
            height: "30px",
            fontSize: "9px",
            fontWeight: "400",
            letterSpacing: "1px",
            lineHeight: "12px",
            paddingBottom: "0px",
            textAlign: "right",
            color: theme.palette.mode === "dark" ? "#ffffff99" : "#00000090",
            marginRight: "0px",
            marginTop: "10px",
            marginBottom: "-16px",
            justifyContent: "flex-end",
            textTransform: "uppercase",
          }}
        >
          {" "}
          Stats refresh every
          <Box
            style={{
              marginLeft: "10px",
              marginTop: "-5px",
              marginBottom: "0px",
              letterSpacing: ".8px",
              border: theme.palette.mode === "dark" ? "1px solid" : "",
              fontSize: "4px",
              width: "115px",
              height: "20px",
            }}
          >
            <FormControl
              style={{
                display: "flex",
                width: "115px",
                height: "20px",
                padding: "0 0 0 0",
                margin: "0 0 0 0",
                fontSize: "4px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  width: "115px",
                  height: "20px",
                  padding: "0 0 0 0",
                  margin: "0 0 0 0",
                  fontSize: "4px",
                }}
              ></InputLabel>
              <Select
                defaultValue={10}
                onChange={handleChangeRefreshSpeed}
                style={{
                  display: "flex",
                  width: "115px",
                  height: "20px",
                  padding: "0 0 0 0",
                  margin: "0 0 0 0",
                  fontSize: "9px",
                }}
              >
                <MenuItem
                  value={10}
                  style={{
                    color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
                  }}
                >
                  10 seconds
                </MenuItem>
                <MenuItem
                  value={20}
                  style={{
                    color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
                  }}
                >
                  20 seconds
                </MenuItem>
                <MenuItem
                  value={30}
                  style={{
                    color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
                  }}
                >
                  30 seconds
                </MenuItem>
                <MenuItem
                  value={60}
                  style={{
                    color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
                  }}
                >
                  60 seconds
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* <Button
            style={{
              marginLeft: "10px",
              marginTop: "-5px",
              marginBottom: "0px",
              letterSpacing: ".8px",
              border: "1px solid",
              fontSize: "9px",
              width: "auto",
              height: "20px",
            }}
            onClick={handleChangeRefreshSpeed}
          >
            {refreshSpeed} seconds
          </Button> */}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "91%",
            height: "30px",
            fontSize: "9px",
            fontWeight: "400",
            letterSpacing: "1px",
            lineHeight: "12px",
            paddingBottom: "0px",
            paddingTop: "5px",
            textAlign: "right",
            color: theme.palette.mode === "dark" ? "#ffffff99" : "grey",
            marginRight: "0px",
            marginTop: "18px",
            justifyContent: "flex-end",
            marginBottom: "-29px",
          }}
        >
          {" "}
          NAMESPACE:
          <LightTooltip
            title="View resources from a specific namespace. These options are populated using the 'kubectl get namespaces' command. Please note: Some namespaces may not have visible pods or deployments."
            placement="top"
            arrow
            enterDelay={1800}
            leaveDelay={100}
            enterNextDelay={3000}
          >
            <Box
              style={{
                marginLeft: "10px",
                marginTop: "-5px",
                marginBottom: "0px",
                letterSpacing: ".8px",
                border: theme.palette.mode === "dark" ? "1px solid" : "",
                fontSize: "4px",
                height: "20px",
                textTransform: "uppercase",
              }}
            >
              <FormControl
                style={{
                  display: "flex",
                  height: "20px",
                  padding: "0 0 0 0",
                  margin: "0 0 0 0",
                  fontSize: "4px",
                }}
              >
                <InputLabel
                  style={{
                    display: "flex",
                    height: "20px",
                    padding: "0 0 0 0",
                    margin: "0 0 0 0",
                    fontSize: "4px",
                  }}
                ></InputLabel>
                <Select
                  defaultValue={"ALL"}
                  onChange={handleNamespaceChange}
                  style={{
                    display: "flex",
                    height: "20px",
                    padding: "0 0 0 0",
                    margin: "0 0 0 0",
                    fontSize: "9px",
                    textTransform: "uppercase",
                  }}
                >
                  {namespacesArr}
                </Select>
              </FormControl>
            </Box>
            {/* <Button
              onClick={handleNamespaceChange}
              style={{
                display: "flex",
                fontSize: "9px",
                fontWeight: "900",
                letterSpacing: ".5px",
                border: "1px solid",
                height: "16px",
                textAlign: "left",
                color: theme.palette.mode === "dark" ? "white" : "#00000099",
                marginTop: "23px",
                marginLeft: "0px",
                marginRight: "2px",
                padding: "8px 4px 8px 6px",
                marginBottom: "-40px",
              }}
            >
              NAMESPACE: {selectedNamespace}
            </Button> */}
          </LightTooltip>
        </div>
      </>
    );
  } else {
    noneChosenDiv = (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: "Outfit",
            margin: "20% 0 0 0",
            fontSize: "28px",
            fontWeight: "900",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: theme.palette.mode === "dark" ? "" : "#00000070",
          }}
        >
          Choose From Above to Begin
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: "Outfit",
            margin: "25% 0 0 0",
            fontSize: "8px",
            fontWeight: "900",
            opacity: ".42",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: theme.palette.mode === "dark" ? "" : "#000000",
          }}
        >
          CLUSTERS STILL NOT APPEARING AFTER CHOOSING?
          <Button
            variant="contained"
            component="label"
            style={{
              backgroundColor: "transparent",
              fontFamily: "Outfit",
              margin: "-7.5px 0 0 -10px",
              fontSize: "8px",
              fontWeight: "900",
              color: theme.palette.mode === "dark" ? "" : "#000000",
            }}
          >
            CLICK HERE TO LOAD A CUSTOM .KUBE/CONFIG FILE
            <input type="file" hidden onChange={handleChooseKubeConfig} />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        {/* ----------------SIDE BAR---------------- */}
        <SideNav />
        {/* ----------------MAIN CONTENT---------------- */}

        <div
          data-height="100%"
          // spacing={1}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
            alignItems: "center",
            marginLeft: "0px",
            marginTop: "35px",
            marginBottom: "20px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: "Outfit",
              fontWeight: "800",
              fontSize: "58px",
              justifyContent: "flex-start",
              userSelect: "none",
              overflowY: "hidden",
              alignItems: "center",
              width: "100%",
              letterSpacing: "0px",
              color: theme.palette.mode === "dark" ? "white" : "#6466b2",
              textShadow:
                theme.palette.mode === "dark" ? "5px 5px 2px #00000060" : "",
            }}
          >
            kaptn krane
          </div>
          <div
            style={{
              fontWeight: "400",
              fontSize: "14.5px",
              alignItems: "center",
              justifyContent: "flex-start",
              userSelect: "none",
              marginBottom: "10px",
              width: "100%",
              letterSpacing: "-.1px",
              color: theme.palette.mode === "dark" ? "white" : "grey",
              textShadow:
                theme.palette.mode === "dark" ? "2px 2px 2px #00000040" : "",
            }}
          >
            Easily manage your clusters, nodes, and containers.
            <br />
            <p></p>
          </div>
          <div style={{ display: "flex", margin: "-5px 0 0 0" }}>
            <Button
              onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark" && !nodeShowStatus
                    ? "1px solid #ffffff"
                    : theme.palette.mode !== "dark" && !nodeShowStatus
                    ? "1px solid #00000060"
                    : "1px solid #8d85f3",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" && !nodeShowStatus
                    ? "#ffffff"
                    : theme.palette.mode !== "dark" && !nodeShowStatus
                    ? "#00000060"
                    : "white",
                backgroundColor: !nodeShowStatus ? "transparent" : "#8d85f3",
              }}
            >
              NODES & PODS
            </Button>
            <Button
              onClick={handleDeploymentsShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark" && !deploymentsShowStatus
                    ? "1px solid #ffffff"
                    : theme.palette.mode !== "dark" && !deploymentsShowStatus
                    ? "1px solid #00000060"
                    : "1px solid #8d85f3",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" && !deploymentsShowStatus
                    ? "#ffffff"
                    : theme.palette.mode !== "dark" && !deploymentsShowStatus
                    ? "#00000060"
                    : "white",
                backgroundColor: !deploymentsShowStatus
                  ? "transparent"
                  : "#8d85f3",
              }}
            >
              DEPLOYMENTS
            </Button>

            <Button
              // onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid #ffffff80"
                    : "1px solid #00000060",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              }}
            >
              DAEMONSETS
            </Button>
            <Button
              // onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid #ffffff80"
                    : "1px solid #00000060",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              }}
            >
              SERVICES
            </Button>
            <Button
              // onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid #ffffff80"
                    : "1px solid #00000060",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              }}
            >
              NAMESPACES
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              margin: "5px 0 0 260px",
              color: theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              fontSize: "9px",
              letterSpacing: ".5px",
            }}
          >
            <div
              style={{
                height: "1px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
                width: "100px",
                margin: "6px 0px 0 0px",
              }}
            ></div>
            <div style={{ margin: "0 5px 0 5px" }}>COMING SOON!</div>
            <div
              style={{
                height: "1px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
                width: "100px",
                margin: "6px 0px 0 0px",
              }}
            ></div>
          </div>

          {refreshShowDiv}
          <div style={{ marginTop: "-18px", width: "100%" }}>
            {nodesAndPodsDiv}
            {deploymentsDiv}
          </div>
        </div>
        {noneChosenDiv}
      </div>
    </>
  );
}

export default Krane;
