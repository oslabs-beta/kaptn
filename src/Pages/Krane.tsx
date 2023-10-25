import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, useTheme, Box, Modal } from "@mui/material";
const { ipcRenderer } = require("electron");
import SideNav from "../components/Sidebar.js";
import LaunchIcon from "@mui/icons-material/Launch";
import { RadioButtonUnchecked } from "@mui/icons-material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { styled } from "@mui/material/styles";
import { JsxElement } from "typescript";
import KraneNodeList from "../components/KraneNodeList.js";
import KranePodList from "../components/KranePodList.js";
import KraneDeploymentsList from "../components/KraneDeploymentsList";

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
  const [deploymentsArr, setDeploymentsArr] = useState([]);
  const [podsArr, setPodsArr] = useState([]);
  const [nodesArr, setNodesArr] = useState([]);
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
  };

  // ----------------------------------------- get pods info section ------------

  function handleClick(event) {
    // setDeploymentsArr([]);
    // setNodesArr([]);
    // setPodsArr([]);
    getDeploymentsInfo();
    getNodesInfo();
    getPodsAndContainers();
  }

  const [deploymentsShowStatus, setDeploymentsShowStatus] = useState(false);

  function handleDeploymentsShowStatus() {
    setNodeShowStatus(false);
    setDeploymentsShowStatus(!deploymentsShowStatus);
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
    }, 200);
  }

  const [nodeShowStatus, setNodeShowStatus] = useState(false);

  function handleNodeShowStatus() {
    setDeploymentsShowStatus(false);
    setNodeShowStatus(!nodeShowStatus);
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
    }, 400);

    // ----------------------------------------------- Beginning of get pod cpu and memory limits section

    let cpuLimitsCommand = `kubectl get po --all-namespaces -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu",Memory-limit:"spec.containers[*].resources.limits.memory"`;
    setTimeout(() => {
      ipcRenderer.send("getCpuLimits_command", {
        cpuLimitsCommand,
        currDir,
      });
    }, 600);

    // send command to get selected pods containers info
    let podContainersCommand = `kubectl top pod --containers`;
    //send get pods o wide info commands
    ipcRenderer.send(
      "podContainers_command",
      {
        podContainersCommand,
        currDir,
      },
      800
    );
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
    }, 200);

    let nodesCpuLimitsCommand: string = `kubectl get nodes -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu,Memory-limit:spec.containers[*].resources.limits.cpu"`;
    setTimeout(() => {
      ipcRenderer.send("getNodesCpuLimits_command", {
        nodesCpuLimitsCommand,
        currDir,
      });
    }, 400);
  }

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let deploymentsDiv;
  if (deploymentsShowStatus) {
    deploymentsDiv = (
      <>
        <KraneDeploymentsList
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
          podsArr={podsArr}
          setPodsArr={setPodsArr}
          getPodsAndContainers={getPodsAndContainers}
          currDir={currDir}
          setCurrDir={setCurrDir}
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
  if (nodeShowStatus || deploymentsShowStatus) {
    refreshShowDiv = (
      <>
        <div
          style={{
            // fontFamily: "Outfit",
            display: "flex",
            flexDirection: "row",
            width: "91%",
            height: "30px",
            fontSize: "9px",
            fontWeight: "400",
            letterSpacing: "1px",
            lineHeight: "12px",
            // border: "1px solid white",
            paddingBottom: "0px",
            textAlign: "right",
            color: "#ffffff99",
            marginRight: "0px",
            marginTop: "0px",
            justifyContent: "flex-end",
            // paddingTop: "50px",
          }}
        >
          {/* <div
              style={{
                marginTop: "5px",
              }}
            >
              <i> STATS AUTOMATICALLY REFRESH EVERY 30 SECONDS</i>
            </div> */}
          <Button
            style={{
              marginLeft: "10px",
              marginTop: "8px",
              marginBottom: "0px",
              letterSpacing: ".8px",
              // padding:"0 0 0 0",
              // border: "1px solid #ffffff99",
              border: "1px solid",
              fontSize: "9px",
              width: "98px",
              height: "20px",

              // color: "#ffffff99",
            }}
            onClick={handleClick}
          >
            Refresh stats
          </Button>
        </div>
      </>
    );
  }

  // console.log("selected pod 3 is ", selectedPod);

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
            // border: "1px solid red",
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
              // border: "1px solid pink",
              textShadow:
                theme.palette.mode === "dark" ? "5px 5px 2px #00000060" : "",
            }}
          >
            kaptn krane
          </div>
          <div
            style={{
              // fontFamily: 'Outfit',
              fontWeight: "400",
              fontSize: "14.5px",
              alignItems: "center",
              justifyContent: "flex-start",
              userSelect: "none",
              marginBottom: "10px",
              width: "100%",
              letterSpacing: "-.1px",
              color: theme.palette.mode === "dark" ? "white" : "grey",
              // border: "1px solid green",
              textShadow:
                theme.palette.mode === "dark" ? "2px 2px 2px #00000040" : "",
            }}
          >
            Easily manage your clusters, nodes, and containers.
            <br />
            <p></p>
            {/* <div>CHOOSE ONE OR MORE:</div> */}
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
                // border: "1px solid",
                fontSize: "12px",
                // width: "98px",
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
                // border: "1px solid #ffffff99",
                border:
                  theme.palette.mode === "dark" && !deploymentsShowStatus
                    ? "1px solid #ffffff"
                    : theme.palette.mode !== "dark" && !deploymentsShowStatus
                    ? "1px solid #00000060"
                    : "1px solid #8d85f3",
                fontSize: "12px",
                // width: "98px",
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
                // border: "1px solid",
                fontSize: "12px",
                // width: "98px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
                // backgroundColor: !nodeShowStatus ? "transparent" : "#8d85f3",
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
                // border: "1px solid",
                fontSize: "12px",
                // width: "98px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
                // backgroundColor: !nodeShowStatus ? "transparent" : "#8d85f3",
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
                // border: "1px solid",
                fontSize: "12px",
                // width: "98px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
                // backgroundColor: !nodeShowStatus ? "transparent" : "#8d85f3",
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
              // border:"1px solid red"
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
          <div style={{ marginBottom: "0px", width: "100%" }}>
            {nodesAndPodsDiv}
            {deploymentsDiv}
          </div>
        </div>
      </div>
    </>
  );
}

export default Krane;
