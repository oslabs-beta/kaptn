import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useTheme, Box, Modal} from "@mui/material";
const { ipcRenderer } = require("electron");
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import NodeCpuChart from "./NodeCpuChart";
import NodeMemoryChart from "./NodeMemoryChart";

// const storage = require('electron-json-storage');

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
    color: "white",
    fontSize: 11,
  },
}));

type NodeType = {
      index: number,
      name: string,
      status: string,
      role: string,
      age: string,
      version: string,
      internalIp: string,
      externalIp: string,
      osImage: string,
      kernal: string,
      containerRuntime: string,
      nodeCpuUsed: string,
      nodeCpuLimit: string,
      nodeCpuPercent: string,
      nodeCpuPercentMath: string,
      nodeMemoryUsed: string,
      nodeMemoryUsedDisplay: string,
      nodeMemoryLimit: string,
      nodeMemoryPercent: string,
}

function KraneNodeList(props) {
  const [openNode, setOpenNode] = React.useState(false);

  const [openNodeLog, setOpenNodeLog] = React.useState(false);
  const [nodeLogs, setNodeLogs] = React.useState<any>([]);

  const [openNodeYaml, setOpenNodeYaml] = React.useState(false);
  const [nodeYaml, setNodeYaml] = React.useState<any>([]);

  const [openNodeDescribe, setOpenNodeDescribe] = React.useState(false);
  const [nodeDescribe, setNodeDescribe] = React.useState<any>([]);

  const [openNodeDrain, setOpenNodeDrain] = React.useState(false);

  const [openNodeCordon, setOpenNodeCordon] = React.useState(false);

  const [openNodeUncordon, setOpenNodeUncordon] = React.useState(false);

  const [openNodeDelete, setOpenNodeDelete] = React.useState(false);

  const [selectedNodeStatusColor, setSelectedNodeStatusColor] = useState("");
  const [selectedNodeCPUColor, setSelectedNodeCPUColor] = useState("");
  const [selectedNodeMemoryColor, setSelectedNodeMemoryColor] = useState("");
  const [selectedNode, setSelectedNode] = useState([
    {
      index: "",
      name: "",
      status: "",
      role: "",
      age: "",
      version: "",
      internalIp: "",
      externalIp: "",
      osImage: "",
      kernal: "",
      containerRuntime: "",
      nodeCpuUsed: "",
      nodeCpuLimit: "",
      nodeCpuPercent: "",
      nodeCpuPercentMath: "",
      nodeMemoryUsed: "",
      nodeMemoryUsedDisplay: "",
      nodeMemoryLimit: "",
      nodeMemoryPercent: "",
    },
  ]);


  const [showExpandedNodeCpuChart, setShowExpandedNodeCpuChart] =
    useState(false);

  const [showExpandedNodeMemoryChart, setShowExpandedNodeMemoryChart] =
    useState(false);

  const theme = useTheme();


  let currDir = props.currDir;
  let filteredNodes : NodeType[] = [];


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

  const openNodeModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "92%",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#eeebfb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    mt: 2,
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
    overflow: "scroll",
    overflowX: "hidden",
  };

  const openPodModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "92%",
    background: theme.palette.mode === "dark" ? "#0e0727" : "#eeebfb",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    mt: 0.8,
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
    overflow: "scroll",
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

  const chartStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "82%",
    height: "65",
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

  const nodeDeleteStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "36%",
    height: "26%",
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

  const nodeDrainStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "32%",
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

  const nodeCordonStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
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

  const nodeUncordonStyle = {
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

  const podDeleteStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "36%",
    height: "26%",
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

  function handleClick(event) {
    props.getNodesInfo();
  } // ---------------------- end of handle click function to refresh pods

  const handleNodeOpen = (node) => {
    if (node["status"] === "Ready") {
      setSelectedNodeStatusColor("#2fc665");
    } else {
      setSelectedNodeStatusColor("rgba(210, 223, 61)");
    }
    setSelectedNode([node]);

    if (typeof selectedNode[0]["podCpuPercent"] === "string") {
      if (selectedNode[0]["podCpuPercent"] === "N/A") {
        setSelectedNodeCPUColor("#ffffff80");
      }
    } else if (selectedNode[0]["podCpuPercent"] < 90) {
      setSelectedNodeCPUColor("#2fc665");
    } else {
      setSelectedNodeCPUColor("#cf4848");
    }

    setOpenNode(true);
  };

  const handleNodeClose = () => {
    setSelectedNode([
      {
        index: "",
        name: "",
        status: "",
        role: "",
        age: "",
        version: "",
        internalIp: "",
        externalIp: "",
        osImage: "",
        kernal: "",
        containerRuntime: "",
        nodeCpuUsed: "",
        nodeCpuLimit: "",
        nodeCpuPercent: "",
        nodeCpuPercentMath: "",
        nodeMemoryUsed: "",
        nodeMemoryUsedDisplay: "",
        nodeMemoryLimit: "",
        nodeMemoryPercent: "",
      },
    ]);
    setOpenNode(false);
  };

  const handlePodOpen = (pod) => {
    if (pod["status"] === "Running") {
      props.setSelectedPodStatusColor("#2fc665");
    } else {
      props.setSelectedPodStatusColor("rgba(210, 223, 61)");
    }
    props.setSelectedPod([pod]);

    if (typeof props.selectedPod[0]["podCpuPercent"] === "string") {
      if (props.selectedPod[0]["podCpuPercent"] === "N/A") {
        props.setSelectedPodCPUColor("#ffffff80");
      }
    } else if (props.selectedPod[0]["podCpuPercent"] < 90) {
      props.setSelectedPodCPUColor("#2fc665");
    } else {
      props.setSelectedPodCPUColor("#cf4848");
    }

    props.setOpenPod(true);
  };

  const handlePodClose = () => {
    props.setSelectedPod([
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
    props.setOpenPod(false);
  };

  const handlePodLogOpen = (pod) => {
    ipcRenderer.on("podLogsRetrieved", (event, arg) => {
      let argArr = arg.split("");
      let temp : string = "";
      let output : JSX.Element[] = [];

      for (let i = 0; i < argArr.length; i++) {
        while (argArr[i] !== "\n") {
          temp += argArr[i];
          i++;
        }

        output.push(<p>{temp}</p>);
      }
      props.setPodLogs(output);
    });

    let podLogsCommand = `kubectl logs ${props.selectedPod[0]["name"]}`;
    //send get pods logs command
    ipcRenderer.send("podLogs_command", {
      podLogsCommand,
      currDir,
    });

    props.setOpenPodLog(true);
  };

  const handlePodLogClose = () => {
    props.setOpenPodLog(false);
  };

  const handlePodYamlOpen = (pod) => {
    ipcRenderer.on("podYamlRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output : JSX.Element[] = [];

      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      props.setPodYaml(output);
    });

    let podYamlCommand = `kubectl get pod ${props.selectedPod[0]["name"]} -o yaml`;
    //send get pod yaml command
    ipcRenderer.send("podYaml_command", {
      podYamlCommand,
      currDir,
    });

    props.setOpenPodYaml(true);
  };

  const handlePodYamlClose = () => {
    props.setOpenPodYaml(false);
  };

  const handlePodDeleteOpen = (pod) => {
    props.setOpenPodDelete(true);
  };

  const handlePodDeleteClose = () => {
    props.setOpenPodDelete(false);
  };

  const handlePodDelete = () => {
    //listen for pods deleted
    ipcRenderer.on("deleted_pod", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      let podsCommand = "kubectl get pods --all-namespaces -o wide";
      //send get pods o wide info commands
      setTimeout(() => {
        ipcRenderer.send("getPods_command", {
          podsCommand,
          currDir,
        });
      }, 1000);

      //---------------------------------------- beginnging get all pods cpu and memory usage section -
      let CpuUsedCommand = `kubectl top pods --all-namespaces`;
      setTimeout(() => {
        ipcRenderer.send("getCpuUsed_command", {
          CpuUsedCommand,
          currDir,
        });
      }, 1500);

      // ----------------------------------------------- Beginning of get pod cpu and memory limits section

      let cpuLimitsCommand = `kubectl get po --all-namespaces -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu",Memory-limit:"spec.containers[*].resources.limits.memory"`;
      setTimeout(() => {
        ipcRenderer.send("getCpuLimits_command", {
          cpuLimitsCommand,
          currDir,
        });
      }, 2000);

      props.setOpenPodDelete(false);
      props.setOpenPod(false);
    });

    let podDeleteCommand = `kubectl delete pod ${props.selectedPod[0]["name"]}`;
    //send get delete pod command
    ipcRenderer.send("deletePod_command", {
      podDeleteCommand,
      currDir,
    });
  };

const [count, setCount] = useState(0)

  //Listen to "get nodes" return event
  ipcRenderer.on("got_nodes", (event, arg) => {
    let nameOutput: any = [];
    let statusOutput: any = [];
    let roleOutput: any = [];
    let ageOutput: any = [];
    let versionOutput: any = [];
    let internalIpOutput: any = [];
    let externalIpOutput: any = [];
    let osImageOutput: any = [];
    let kernalOutput: any = [];
    let containerRuntimeOutput: any = [];

    let i: number = 0;

    //skip row of column titles
    while (arg[i] !== "\n") {
      i++;
    }
    i++;

    let argArr = arg.split("");
    for (let j = 0; i < argArr.length; i++) {
      while (arg[i] !== " ") {
        nameOutput.push(arg[i]);
        i++;
      }
      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        statusOutput.push(arg[i]);
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        roleOutput.push(arg[i]);
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        ageOutput.push(arg[i]);
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        versionOutput.push(arg[i]);
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        internalIpOutput.push(arg[i]);
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        externalIpOutput.push(arg[i]);
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " " || arg[i + 1] !== " ") {
        osImageOutput.push(arg[i]);
        i++;
      }
      if (osImageOutput[osImageOutput.length - 1] === " ") {
        osImageOutput.pop();
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        kernalOutput.push(arg[i]);
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== "\n") {
        containerRuntimeOutput.push(arg[i]);
        i++;
      }
      let node = {
        index: j,
        name: nameOutput.join(""),
        status: statusOutput.join(""),
        role: roleOutput.join(""),
        age: ageOutput.join(""),
        version: versionOutput.join(""),
        internalIp: internalIpOutput.join(""),
        externalIp: externalIpOutput.join(""),
        osImage: osImageOutput.join(""),
        kernal: kernalOutput.join(""),
        containerRuntime: containerRuntimeOutput.join(""),
        nodeCpuUsed: "",
        nodeCpuLimit: "",
        nodeCpuPercent: "",
        nodeCpuPercentMath: "",
        nodeMemoryUsed: "",
        nodeMemoryUsedDisplay: "",
        nodeMemoryLimit: "",
        nodeMemoryPercent: "",
      };

      filteredNodes.push(node);
      j++;
    } // ---------- end of for loop

    let finalNodesInfoArr = filteredNodes.filter(
      (ele: any, ind: number) =>
        ind ===
        filteredNodes.findIndex(
          (elem) => elem.name === ele.name && elem.role === ele.role
        )
    );
    filteredNodes = finalNodesInfoArr;

    props.setNodesArr([...filteredNodes]);
  }); // ------------------------------------------ end of ipc render for get nodes command

  //Listen to "get cpuUsed" return event
  ipcRenderer.on("got_nodesCpuUsed", (event, arg) => {
    let date = new Date().toISOString();
    // let tempNodesStatsObj = JSON.parse(JSON.stringify(podsStatsObj));
    let tempNodesStatsObj = props.nodesStatsObj;

    let argArr = arg.split("");

    let nodeUsageArray : any[] = [];

    let i: number = 0;

    //skips row of column titles
    while (argArr[i] !== "\n") {
      i++;
    }
    i++;

    // //for loop to parse response and put all nodes' stats in array of objects
    for (let j = 0; i < argArr.length; i++) {
      let nodeNameArr : string[] = [];
      let nodeCpuUsedArr : string[] = [];
      let nodeCpuPercentArr : string[] = [];
      let nodeMemoryUsedArr : string[] = [];
      let nodeMemoryPercentArr : string[] = [];

      //saves name because array order is same for both outputs
      while (argArr[i] !== " ") {
        nodeNameArr.push(arg[i]);
        i++;
      }
      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }
      //  save cpu(cores) to array to parse at end of loops
      while (
        argArr[i] === "1" ||
        argArr[i] === "2" ||
        argArr[i] === "3" ||
        argArr[i] === "4" ||
        argArr[i] === "5" ||
        argArr[i] === "6" ||
        argArr[i] === "7" ||
        argArr[i] === "8" ||
        argArr[i] === "9" ||
        argArr[i] === "0"
      ) {
        nodeCpuUsedArr.push(argArr[i]);
        i++;
      }
      i++;

      //skip spaces after number of cores
      while (arg[i] === " ") {
        i++;
      }
      //saves cpu percent
      while (argArr[i] !== " ") {
        nodeCpuPercentArr.push(arg[i]);
        i++;
      }

      //skip spaces
      while (arg[i] === " ") {
        i++;
      }

      //save memory used before unit of measure
      while (
        argArr[i] === "1" ||
        argArr[i] === "2" ||
        argArr[i] === "3" ||
        argArr[i] === "4" ||
        argArr[i] === "5" ||
        argArr[i] === "6" ||
        argArr[i] === "7" ||
        argArr[i] === "8" ||
        argArr[i] === "9" ||
        argArr[i] === "0"
      ) {
        nodeMemoryUsedArr.push(arg[i]);
        i++;
      }
      let nodeMemoryUsedDisplay;
      if (argArr[i] === "G") {
        nodeMemoryUsedDisplay = [...nodeMemoryUsedArr, "G", "i"];
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
      } else if (argArr[i] === "M") {
        nodeMemoryUsedDisplay = [...nodeMemoryUsedArr, "M", "i"];
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
      }
      i += 2;

      //skip spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves memory percent
      while (argArr[i] !== " ") {
        nodeMemoryPercentArr.push(arg[i]);
        i++;
      }

      //skip spaces
      while (arg[i] === " ") {
        i++;
      }

      //join used values and add them to object
      let node = {
        nodeName: nodeNameArr.join(""),
        nodeCpuUsed: nodeCpuUsedArr.join(""),
        nodeCpuPercent: nodeCpuPercentArr.join(""),
        nodeCpuPercentMath: Number(nodeCpuPercentArr.join("").slice(0, -1)),
        nodeMemoryUsed: nodeMemoryUsedArr.join(""),
        nodeMemoryPercent: nodeMemoryPercentArr.join(""),
        nodeMemoryUsedDisplay: nodeMemoryUsedDisplay.join(""),
      };

      i++;

      nodeUsageArray.push(node);
    } //end of for loop

    props.setNodesUsageArr([...nodeUsageArray])

    let finalNodeUsageArr = nodeUsageArray.filter(
      (ele: any, ind: number) =>
        ind ===
        nodeUsageArray.findIndex((elem) => elem.nodeName === ele.nodeName)
    );

    for (let j = 0; j < finalNodeUsageArr.length; j++) {
      filteredNodes[j]["nodeCpuUsed"] = finalNodeUsageArr[j]["nodeCpuUsed"];
      filteredNodes[j]["nodeCpuPercent"] =
        finalNodeUsageArr[j]["nodeCpuPercent"];
      filteredNodes[j]["nodeCpuPercentMath"] =
        finalNodeUsageArr[j]["nodeCpuPercentMath"];
      filteredNodes[j]["nodeMemoryUsed"] =
        finalNodeUsageArr[j]["nodeMemoryUsed"];
      filteredNodes[j]["nodeMemoryPercent"] =
        finalNodeUsageArr[j]["nodeMemoryPercent"];
      filteredNodes[j]["nodeMemoryUsedDisplay"] =
        finalNodeUsageArr[j]["nodeMemoryUsedDisplay"];
    }

    props.setNodesArr([...filteredNodes]);

    for (let j = 0; j < nodeUsageArray.length; j++) {
      if (tempNodesStatsObj[nodeUsageArray[j]["nodeName"]] === undefined) {
        let nodesCurrentStats = {
          date: date,
          cpu: Number(nodeUsageArray[j]["nodeCpuUsed"]),
          memory: Number(nodeUsageArray[j]["nodeMemoryUsed"]),
          memoryDisplay: nodeUsageArray[j]["nodeMemoryUsedDisplay"],
        };

        tempNodesStatsObj[nodeUsageArray[j]["nodeName"]] = [nodesCurrentStats];
      } else {
        let nodesCurrentStats = {
          date: date,
          cpu: Number(nodeUsageArray[j]["nodeCpuUsed"]),
          memory: Number(nodeUsageArray[j]["nodeMemoryUsed"]),
          memoryDisplay: nodeUsageArray[j]["nodeMemoryUsedDisplay"],
        };

        tempNodesStatsObj[nodeUsageArray[j]["nodeName"]].push(
          nodesCurrentStats
        );
      }
    }

    props.setNodesStatsObj(tempNodesStatsObj);
  });

  //
  //Listen to "get nodeCpuUsed" return event
  ipcRenderer.on("got_nodesCpuLimits", (event, arg) => {
    let argArr = arg.split("");
    let nodeLimitsArray : any[] = [];

    let node = {};

    let i: number = 0;

    //skips "name"
    while (argArr[i] !== " ") {
      i++;
    }

    //skips spaces
    while (argArr[i] === " ") {
      i++;
    }
    //skips "CPU-limits"
    while (argArr[i] !== " ") {
      i++;
    }
    //skips spaces
    while (argArr[i] === " ") {
      i++;
    }

    //skips "memory-limits"
    i += 13;

    // //for loop to put all pods in array of objects
    for (let j = 0; i < argArr.length; i++) {
      let nodeCpuLimitsArr : string[] = [];
      let nodeMemoryLimitsArr : string[] = [];
      let nodeNameArr : string[] = [];

      //take name because maybe be duplicate values]
      while (argArr[i] !== " ") {
        nodeNameArr.push(argArr[i]);
        i++;
      }
      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }

      if (argArr[i] === "<") {
        nodeCpuLimitsArr = ["N", "O", "N", "E"];
        i += 7;
      } else {
        //   //   // //save cpu-limits to array to parse at end of loops
        while (
          argArr[i] === "1" ||
          argArr[i] === "2" ||
          argArr[i] === "3" ||
          argArr[i] === "4" ||
          argArr[i] === "5" ||
          argArr[i] === "6" ||
          argArr[i] === "7" ||
          argArr[i] === "8" ||
          argArr[i] === "9" ||
          argArr[i] === "0"
        ) {
          nodeCpuLimitsArr.push(argArr[i]);
          i++;
        }
        // i++;
      }

      //skip spaces after cpu limt value
      while (arg[i] !== " ") {
        i++;
      }

      //skip spaces
      while (arg[i] === " ") {
        i++;
      }

      if (argArr[i] === "<") {
        nodeMemoryLimitsArr = ["N", "O", "N", "E"];
        i += 6;
      } else {
        //save memory limit before unit of measure
        while (
          argArr[i] === "1" ||
          argArr[i] === "2" ||
          argArr[i] === "3" ||
          argArr[i] === "4" ||
          argArr[i] === "5" ||
          argArr[i] === "6" ||
          argArr[i] === "7" ||
          argArr[i] === "8" ||
          argArr[i] === "9" ||
          argArr[i] === "0"
        ) {
          nodeMemoryLimitsArr.push(arg[i]);
          i++;
        }
        if (argArr[i] === "G") {
          nodeMemoryLimitsArr.push("0");
          nodeMemoryLimitsArr.push("0");
          nodeMemoryLimitsArr.push("0");
          nodeMemoryLimitsArr.push("0");
          nodeMemoryLimitsArr.push("0");
          nodeMemoryLimitsArr.push("0");
        } else if (argArr[i] === "M") {
          nodeMemoryLimitsArr.push("0");
          nodeMemoryLimitsArr.push("0");
          nodeMemoryLimitsArr.push("0");
        }

        i += 3;
      }

      //   //join used values and add them to object
      node = {
        nodeName: nodeNameArr.join(""),
        nodeCpuLimit: nodeCpuLimitsArr.join(""),
        nodeMemoryLimit: nodeMemoryLimitsArr.join(""),
      };

      j++;

      nodeLimitsArray.push(node);

      node = {};
    } //end of for loop

    let lastNodesArr = nodeLimitsArray.filter(
      (ele: any, ind: number) =>
        ind ===
        nodeLimitsArray.findIndex((elem) => elem.nodeName === ele.nodeName)
    );

    for (let j = 0; j < lastNodesArr.length; j++) {
      filteredNodes[j]["nodeCpuLimit"] = lastNodesArr[j]["nodeCpuLimit"];
      filteredNodes[j]["nodeMemoryLimit"] = lastNodesArr[j]["nodeMemoryLimit"];
    }

    props.setNodesArr([...filteredNodes]);
    props.setNodesLimitsArr([...nodeLimitsArray])
  });

  useEffect(() => {
    // ----------------------------------------- get NODES section ------------
    props.getNodesInfo();

  }, []);

  const handleNodeLogOpen = (pod) => {
    ipcRenderer.on("nodeLogsRetrieved", (event, arg) => {
      let argArr = arg.split("");
      let temp : string = "";
      let output : JSX.Element[]= [];

      for (let i = 0; i < argArr.length; i++) {
        while (argArr[i] !== "\n") {
          temp += argArr[i];
          i++;
        }
        output.push(<p>{temp}</p>);
      }
      setNodeLogs(output);
    });

    let nodeLogsCommand = `kubectl logs ${selectedNode[0]["name"]}`;
    //send get nodes logs command
    ipcRenderer.send("nodeLogs_command", {
      nodeLogsCommand,
      currDir,
    });

    setOpenNodeLog(true);
  };

  const handleNodeLogClose = () => {
    setOpenNodeLog(false);
  };

  const handleNodeYamlOpen = (pod) => {
    ipcRenderer.on("nodeYamlRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output : JSX.Element[] = [];

      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      setNodeYaml(output);
    });

    let nodeYamlCommand = `kubectl get node ${selectedNode[0]["name"]} -o yaml`;

    //send get nodes yaml command
    ipcRenderer.send("nodeYaml_command", {
      nodeYamlCommand,
      currDir,
    });

    setOpenNodeYaml(true);
  };

  const handleNodeYamlClose = () => {
    setOpenNodeYaml(false);
  };

  const handleNodeCpuChartOpen = (pod) => {
    setShowExpandedNodeCpuChart(true);
  };

  const handleNodeCpuChartClose = () => {
    setShowExpandedNodeCpuChart(false);
  };

  const handleNodeMemoryChartOpen = (pod) => {
    setShowExpandedNodeMemoryChart(true);
  };

  const handleNodeMemoryChartClose = () => {
    setShowExpandedNodeMemoryChart(false);
  };

  const handleNodeDescribeOpen = (pod) => {
    ipcRenderer.on("nodeDescribeRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output : JSX.Element[] = [];

      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      setNodeDescribe(output);
    });

    let nodeDescribeCommand = `kubectl describe node ${selectedNode[0]["name"]}`;

    //send node describe commands
    ipcRenderer.send("nodeDescribe_command", {
      nodeDescribeCommand,
      currDir,
    });

    setOpenNodeDescribe(true);
  };

  const handleNodeDescribeClose = () => {
    setOpenNodeDescribe(false);
  };

  const handleNodeDrainOpen = (pod) => {
    setOpenNodeDrain(true);
  };

  const handleNodeDrainClose = () => {
    setOpenNodeDrain(false);
  };

  const handleNodeDrain = () => {
    //listen for pods deleted
    ipcRenderer.on("drained_pod", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getNodesInfo();

      setOpenNodeDrain(false);
      setOpenNode(false);
    });

    let nodeDrainCommand = `kubectl drain node ${selectedNode[0]["name"]}`;
    //send get drain node command
    ipcRenderer.send("drainNode_command", {
      nodeDrainCommand,
      currDir,
    });
  };

  const handleNodeCordonOpen = (pod) => {
    setOpenNodeCordon(true);
  };

  const handleNodeCordonClose = () => {
    setOpenNodeCordon(false);
  };

  const handleNodeCordon = () => {
    //listen for pods deleted
    ipcRenderer.on("cordoned_pod", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getNodesInfo();

      setOpenNodeCordon(false);
      setOpenNode(false);
    });

    let nodeCordonCommand = `kubectl cordon node ${selectedNode[0]["name"]}`;
    //send get drain node command
    ipcRenderer.send("cordonNode_command", {
      nodeCordonCommand,
      currDir,
    });
  };

  const handleNodeUncordonOpen = (pod) => {
    setOpenNodeUncordon(true);
  };

  const handleNodeUncordonClose = () => {
    setOpenNodeUncordon(false);
  };

  const handleNodeUncordon = () => {
    //listen for pods deleted
    ipcRenderer.on("uncordoned_pod", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getNodesInfo();

      setOpenNodeUncordon(false);
      setOpenNode(false);
    });

    let nodeUncordonCommand = `kubectl uncordon node ${selectedNode[0]["name"]}`;
    //send get drain node command
    ipcRenderer.send("uncordonNode_command", {
      nodeUncordonCommand,
      currDir,
    });
  };

  const handleNodeDeleteOpen = (pod) => {
    setOpenNodeDelete(true);
  };

  const handleNodeDeleteClose = () => {
    setOpenNodeDelete(false);
  };

  const handleNodeDelete = () => {
    //listen for pods deleted
    ipcRenderer.on("deleted_pod", (event, arg) => {
      //parse response to check if successful and if so, close modals and refresh list

      props.getNodesInfo();

      setOpenNodeDelete(false);
      setOpenNode(false);
    });

    let nodeDeleteCommand = `kubectl delete node ${selectedNode[0]["name"]}`;
    //send get delete pod command
    ipcRenderer.send("deleteNode_command", {
      nodeDeleteCommand,
      currDir,
    });
  };

  //-----------------------------------------------------------START OF FOR LOOP TO PUSH NODE LIST JSX

  let nodeList : JSX.Element[] = [];
  for (let i = 0; i < props.nodesArr.length; i++) {
    let nodeReadyStatusRunning;
    let nodeReadyStatusRunningLight;
    let nodeCpuPercentColor;
    let nodeCpuPercentColorLight;
    let nodeMemoryPercentColor;
    let nodeMemoryPercentColorLight;

    if (props.nodesArr[i]["status"] === "Ready") {
      nodeReadyStatusRunning = "#2fc665";
      nodeReadyStatusRunningLight = "#5bb57b";
    } else {
      nodeReadyStatusRunning = "rgba(210, 223, 61)";
      nodeReadyStatusRunningLight = "rgba(210, 223, 61)";
    }

    if (props.nodesArr[i]["nodeCpuPercentMath"] < 90) {
      nodeCpuPercentColor = "#2fc665";
      nodeCpuPercentColorLight = "#5bb57b";
    } else {
      nodeCpuPercentColor = "#cf4848";
      nodeCpuPercentColorLight = "#d35656";
    }

    let temp = Number(props.nodesArr[i]["nodeMemoryPercent"].slice(0, -1));
    if (temp < 90) {
      nodeMemoryPercentColor = "#2fc665";
      nodeMemoryPercentColorLight = "#5bb57b";
    } else {
      nodeMemoryPercentColor = "#cf4848";
      nodeMemoryPercentColorLight = "#d35656";
    }

    nodeList.push(
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
        NODE {i + 1}
        <Button
          key={i}
          id="podButt"
          onClick={() => handleNodeOpen(props.nodesArr[i])}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "450px",
            height: "145px",
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
            background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb80",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "440px",
              justifyContent: "space-between",
            }}
          >
            <img
              style={{
                width: "40px",
                marginRight: "0px",
                marginLeft: "10.8px",
              }}
              src="./assets/node.svg"
            ></img>
            <span
              style={{
                margin: "5px 0 0 0px",
                width: "320px",
                lineHeight: "23px",
                fontSize: "18px",
                textTransform: "none",
              }}
            >
              {props.nodesArr[i]["name"]}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                alignItems: "flex-end",
                justifyContent: "right",
                margin: "0px 10px 0 0",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "15px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? `${nodeReadyStatusRunning}`
                      : `${nodeReadyStatusRunningLight}`,
                  justifyContent: "right",
                  margin: "0px 0 2px 0",
                }}
              ></div>
              <div
                style={{
                  fontSize: "10px",
                  margin: "0px 0 0 0",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodeReadyStatusRunning}`
                      : `${nodeReadyStatusRunningLight}`,
                }}
              >
                {props.nodesArr[i]["status"]}
              </div>
            </div>
          </div>
          {/*---------------------------------------------------------- */}
          {/*                  beginng of row of stats below pod name   */}
          {/*---------------------------------------------------------- */}
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              justifyContent: "left",
              alignItems: "flex-start",
              width: "100%",
              padding: "0px 0px 0px 70px",
              margin: "-10px 0px 0px 0px",
              fontSize: "15px",
            }}
          >
            <br />
            <div
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                textAlign: "left",
                width: "200px",
                fontSize: "11px",
                padding: "5px 0px 0 0px",
                fontWeight: "400",
                marginTop: "3px",
                lineHeight: "14px",
                textTransform: "none",
                opacity: "",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000099",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "12px",
                  color: theme.palette.mode === "dark" ? "#ffffff" : "white",
                  fontWeight: "500",
                  margin: "-4px 0 4px 0",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#7f78d8" : "#928dd0",
                  padding: "3px 3px 3px 4px",
                  borderRadius: "3px",
                  width: `${props.nodesArr[i]["role"].length * 8.1}px`,
                }}
              >
                {props.nodesArr[i]["role"].toUpperCase()}
              </div>
              <div style={{ margin: "-11px 0 0 0" }}>
                {" "}
                <br />
                CPU USAGE:{" "}
                {props.nodesArr[i]["nodeCpuLimit"] === "NONE" ||
                props.nodesArr[i]["nodeCpuLimit"] === ""
                  ? `${props.nodesArr[i]["nodeCpuUsed"]}m`
                  : `${props.nodesArr[i]["nodeCpuUsed"]}m / ${props.nodesArr[i]["nodeCpuLimit"]}m`}
                <br />
                CPU PERCENT: {props.nodesArr[i]["nodeCpuPercent"]}
                <br />
                MEMORY USAGE: {`${props.nodesArr[i]["nodeMemoryUsedDisplay"]}`}
                <br />
                MEMORY PERCENT: {props.nodesArr[i]["nodeMemoryPercent"]}
              </div>
            </div>

            <div
              style={{
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                width: "70px",
                fontSize: "4",
                padding: "6px 0px 0 0px",
                fontWeight: "400",
                marginRight: "18px",
                marginTop: "20px",
              }}
            >
              <div>
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "18px",
                    marginLeft: "10.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff40" : "#00000015",
                    width: "68px",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={Number(props.nodesArr[i]["nodeCpuPercentMath"]) * 0.73}
                  style={{
                    position: "relative",
                    top: "-48.5px",
                    left: "9.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark"
                        ? `${nodeCpuPercentColor}`
                        : `${nodeCpuPercentColorLight}`,
                    width: "68px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-48px",
                  left: "5px",
                  fontSize: !props.nodesArr[i]["nodeCpuPercent"]
                    ? "13px"
                    : "16px",
                  fontWeight: "500",
                  marginTop: !props.nodesArr[i]["nodeCpuPercent"]
                    ? "-55px"
                    : "-60px",
                  marginLeft: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodeCpuPercentColor}`
                      : `${nodeCpuPercentColorLight}`,
                }}
              >
                {!props.nodesArr[i]["nodeCpuPercent"]
                  ? "LOADING"
                  : props.nodesArr[i]["nodeCpuPercent"]}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  position: "relative",
                  top: "-48px",
                  left: "-1.5px",
                  marginRight: "-2px",
                  fontWeight: "500",
                  marginTop: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodeCpuPercentColor}`
                      : `${nodeCpuPercentColorLight}`,
                }}
              >
                CPU
              </div>
            </div>

            <div
              style={{
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                width: "70px",
                fontSize: "4",
                padding: "6px 0px 0 0px",
                fontWeight: "400",
                marginRight: "18px",
                marginTop: "20px",
              }}
            >
              <div>
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "18px",
                    marginLeft: "9.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff40" : "#00000015",
                    width: "68px",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={
                    Number(
                      `${props.nodesArr[i]["nodeMemoryPercent"].slice(0, -1)}`
                    ) * 0.73
                  }
                  style={{
                    position: "relative",
                    top: "-48.5px",
                    left: "8.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark"
                        ? `${nodeMemoryPercentColor}`
                        : `${nodeMemoryPercentColorLight}`,
                    width: "68px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-48px",
                  left: "5px",
                  fontWeight: "500",
                  marginLeft: "-10px",
                  fontSize: !props.nodesArr[i]["nodeMemoryPercent"]
                    ? "13px"
                    : "16px",
                  marginTop: !props.nodesArr[i]["nodeMemoryPercent"]
                    ? "-55px"
                    : "-60px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodeMemoryPercentColor}`
                      : `${nodeMemoryPercentColorLight}`,
                }}
              >
                {!props.nodesArr[i]["nodeMemoryPercent"]
                  ? "LOADING"
                  : `${props.nodesArr[i]["nodeMemoryPercent"]}`}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  position: "relative",
                  top: "-48px",
                  left: "-.5px",
                  marginRight: "-2px",
                  fontWeight: "500",
                  marginTop: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodeMemoryPercentColor}`
                      : `${nodeMemoryPercentColorLight}`,
                }}
              >
                MEMORY
              </div>
            </div>
          </span>
          {}
        </Button>
      </div>
    );
  }

  let nodesPodsList : JSX.Element[] = [];
  let tempPodList = props.allPodsArr.filter(
    (pod) => selectedNode[0]["name"] === pod["node"]
  );
  for (let i = 0; i < tempPodList.length; i++) {
    let nodesPodsStatuColor;
    let nodesPodsCpuPercentColor;
    let nodesPodsCpuPercentColorLight;
    let nodesPodsMemoryColor;
    let nodesPodsMemoryColorLight;

    if (tempPodList[i]["status"] === "Running") {
      nodesPodsStatuColor = "#2fc665";
    } else {
      nodesPodsStatuColor = "rgba(210, 223, 61)";
    }

    if (tempPodList[i]["podCpuLimit"] === "NONE") {
      nodesPodsCpuPercentColor = "#ffffff80";
      nodesPodsCpuPercentColorLight = "#00000045";
    } else if (
      (100 * Number(tempPodList[i]["podCpuUsed"])) /
        Number(`${tempPodList[i]["podCpuLimit"]}`) <
      90
    ) {
      nodesPodsCpuPercentColor = "#2fc665";
      nodesPodsCpuPercentColorLight = "#2fc665";
    } else {
      nodesPodsCpuPercentColor = "#cf4848";
      nodesPodsCpuPercentColorLight = "#cf4848";
    }

    if (tempPodList[i]["podMemoryLimit"] === "NONE") {
      nodesPodsMemoryColor = "#ffffff80";
      nodesPodsMemoryColorLight = "#00000045";
    } else if (tempPodList[i]["podMemoryPercent"] < 90) {
      nodesPodsMemoryColor = "#2fc665";
      nodesPodsMemoryColorLight = "#2fc665";
    } else {
      nodesPodsMemoryColor = "#cf4848";
      nodesPodsMemoryColorLight = "#cf4848";
    }

    nodesPodsList.push(
      <div
        key={i}
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Outfit",
          fontWeight: "400",
          fontSize: "16px",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          textAlign: "left",
          width: "auto",
          margin: "17px 0px 0px 0px",
          padding: "0 30px 0px 0",
          letterSpacing: "1px",
          color: theme.palette.mode === "dark" ? "#8f85fb" : "#9075ea",
          textShadow:
            theme.palette.mode === "dark"
              ? "1px 1px 2px black"
              : "1px 1px 1px #00000000",
        }}
      >
        POD {i + 1}
        <Button
          key={i}
          id="podButt"
          onClick={() => handlePodOpen(props.allPodsArr[i])}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "380px",
            height: "125px",
            fontSize: "16px",
            justifyContent: "center",
            textAlign: "left",
            alignItems: "space-between",
            margin: "2px 0 0 0",
            padding: "5px 0px 0px 0px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            border:
              theme.palette.mode === "dark"
                ? "1.3px solid white"
                : "1.3px solid grey",
            borderRadius: "5px",
            boxShadow:
              theme.palette.mode === "dark"
                ? "10px 9px 2px #00000060"
                : "10px 10px 1px #00000000",
            background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "350px",
              margin: "20px 0 0 0",
            }}
          >
            <img
              style={{ width: "45px", marginLeft: "0px" }}
              src="./assets/pod.svg"
            ></img>
            <span
              style={{
                margin: "0px 0 0 15px",
                width: "250px",
                lineHeight: "19px",
                textTransform: "none",
                fontSize: "15px",
              }}
            >
              {tempPodList[i]["name"]}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                alignItems: "flex-end",
                justifyContent: "right",
                margin: "3px -3px 0 28px",
              }}
            >
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "15px",
                  backgroundColor: `${nodesPodsStatuColor}`,
                  justifyContent: "right",
                  margin: "-5px 0 0px 0",
                }}
              ></div>
              <div
                style={{
                  color: `${nodesPodsStatuColor}`,
                  justifyContent: "right",
                  fontSize: "9px",
                  margin: "2px 0 0px 0",
                  lineHeight: "10px",
                }}
              >
                {tempPodList[i]["ready"]}
                <br />
                {tempPodList[i]["status"]}
              </div>
            </div>
          </div>
          {/*---------------------------------------------------------------- */}
          {/*                  beginng of row of stats below conatiner name   */}
          {/*---------------------------------------------------------------- */}
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              justifyContent: "left",
              alignItems: "flex-start",
              width: "100%",
              alignContent: "flex-end",
              padding: "0px 0px 0px 70px",
              margin: "5px 0px 0px 0px",
              fontSize: "15px",
            }}
          >
            <br />
            <div
              style={{
                flexDirection: "column",
                justifyContent: "left",
                textAlign: "left",
                width: "290px",
                fontSize: "10px",
                padding: "0px 0px 0 0px",
                fontWeight: "400",
                margin: "-3px 0 0 0",
                lineHeight: "13px",
                textTransform: "none",
                opacity: ".5",
              }}
            >
              AGE: {`${tempPodList[i]["age"]}`}
              <br />
              CPU USAGE: {`${tempPodList[i]["podCpuUsed"]}m`}
              <br />
              MEMORY USAGE: {tempPodList[i]["podMemoryUsedDisplay"]}
              <br />
              RESTARTS (LAST): {tempPodList[i]["restarts"]} /{" "}
              {tempPodList[i]["lastRestart"]}
            </div>

            <div
              style={{
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                width: "70px",
                height: "70px",
                fontSize: "4",
                padding: "0px 0px 0px 0px",
                fontWeight: "400",
                marginLeft: "0px",
                marginRight: "5px",
                marginTop: "3px",
                marginBottom: "0px",
              }}
            >
              <div>
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "10px",
                    marginLeft: "10.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff40" : "#00000020",
                    width: "60px",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={
                    tempPodList[i]["podCpuLimit"] === "NONE"
                      ? 0
                      : ((100 * Number(tempPodList[i]["podCpuUsed"])) /
                          Number(`${tempPodList[i]["podCpuLimit"]}`)) *
                        0.73
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
                    left: "5.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark"
                        ? `${nodesPodsCpuPercentColor}`
                        : `${nodesPodsCpuPercentColorLight}`,
                    width: "60px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-43px",
                  left: "5px",
                  fontSize:
                    tempPodList[i]["podCpuLimit"] === "NONE" ? "13px" : "16px",
                  fontWeight: "500",
                  marginTop:
                    tempPodList[i]["podCpuLimit"] === "NONE"
                      ? "-55px"
                      : "-60px",
                  marginLeft:
                    tempPodList[i]["podCpuLimit"] === "NONE" ? "-12px" : "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodesPodsCpuPercentColor}`
                      : `${nodesPodsCpuPercentColorLight}`,
                }}
              >
                {tempPodList[i]["podCpuLimit"] === "NONE"
                  ? `no max`
                  : `${
                      100 *
                      (Number(tempPodList[i]["podCpuUsed"]) /
                        Number(tempPodList[i]["podCpuLimit"]))
                    }%`}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  position: "relative",
                  top: "-43px",
                  left: "-1.5px",
                  marginRight: "-2px",
                  fontWeight: "500",
                  marginTop: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodesPodsCpuPercentColor}`
                      : `${nodesPodsCpuPercentColorLight}`,
                }}
              >
                CPU
              </div>
            </div>

            <div
              style={{
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                width: "70px",
                height: "40px",
                fontSize: "4",
                padding: "0px 0px 0 0px",
                fontWeight: "400",
                marginRight: "8px",
                marginTop: "3px",
              }}
            >
              <div>
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "10px",
                    marginLeft: "9.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff40" : "#00000020",
                    width: "60px",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={
                    tempPodList[i]["podMemoryLimit"] === "NONE"
                      ? 0
                      : 0.73 * tempPodList[i]["podMemoryPercent"]
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
                    left: "4.8px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark"
                        ? `${nodesPodsMemoryColor}`
                        : `${nodesPodsMemoryColorLight}`,
                    width: "60px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-43px",
                  left: "5px",
                  fontWeight: "500",
                  marginLeft: "-12px",
                  fontSize:
                    tempPodList[i]["podMemoryLimit"] === "NONE"
                      ? "13px"
                      : "16px",
                  marginTop:
                    tempPodList[i]["podMemoryLimit"] === "NONE"
                      ? "-55px"
                      : "-60px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodesPodsMemoryColor}`
                      : `${nodesPodsMemoryColorLight}`,
                }}
              >
                {tempPodList[i]["podMemoryLimit"] === "NONE"
                  ? `no max`
                  : `${Math.min(
                      Math.round(
                        100 *
                          (Number(tempPodList[i]["podMemoryUsed"]) /
                            Number(tempPodList[i]["podMemoryLimit"])) *
                          10
                      ) / 10,

                      100
                    )}%`}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  position: "relative",
                  top: "-43px",
                  left: "-2.5px",
                  marginRight: "-2px",
                  fontWeight: "500",
                  marginTop: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodesPodsMemoryColor}`
                      : `${nodesPodsMemoryColorLight}`,
                }}
              >
                MEMORY
              </div>
            </div>
          </span>
          {}
        </Button>
      </div>
    );
  }

  let podContainerList : JSX.Element[] = [];
  let tempContainerList = props.podsContainersArr.filter(
    (container) => props.selectedPod[0]["name"] === container["podName"]
  );

  for (let i = 0; i < tempContainerList.length; i++) {
    let containerStatusColor;
    let containerCpuPercentColor;
    let containerCpuPercentColorLight;
    let containerMemoryColor;
    let containerMemoryColorLight;

    if (props.selectedPod[0]["status"] === "Running") {
      containerStatusColor = "#2fc665";
    } else {
      containerStatusColor = "rgba(210, 223, 61)";
    }

    if (props.selectedPod[0]["podCpuLimit"] === "NONE") {
      containerCpuPercentColor = "#ffffff80";
      containerCpuPercentColorLight = "#00000040";
    } else if (
      (100 * Number(tempContainerList[i]["cpuUsage"].slice(0, -1))) /
        Number(`${props.selectedPod[0]["podCpuLimit"]}`) <
      90
    ) {
      containerCpuPercentColor = "#2fc665";
      containerCpuPercentColorLight = "#2fc665";
    } else {
      containerCpuPercentColor = "#cf4848";
      containerCpuPercentColorLight = "#cf4848";
    }

    if (props.selectedPod[0]["podMemoryLimit"] === "NONE") {
      containerMemoryColor = "#ffffff80";
      containerMemoryColorLight = "#00000040";
    } else if (
      Math.min(
        Math.round(
          100 *
            (Number(tempContainerList[i]["memoryUsageMath"]) /
              Number(props.selectedPod[0]["podMemoryLimit"])) *
            10
        ) / 10,

        100
      ) < 90
    ) {
      containerMemoryColor = "#2fc665";
      containerMemoryColorLight = "#2fc665";
    } else {
      containerMemoryColor = "#cf4848";
      containerMemoryColorLight = "#cf4848";
    }

    podContainerList.push(
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
          margin: "17px 0px 0px 0px",
          padding: "0 30px 0px 0",
          letterSpacing: "1px",
          color: theme.palette.mode === "dark" ? "#8f85fb" : "#9075ea",
          textShadow:
            theme.palette.mode === "dark"
              ? "1px 1px 2px black"
              : "1px 1px 1px #00000000",
        }}
      >
        CONTAINER {i + 1}
        <Button
          key={i}
          id="podButt"
          // onClick={() => handlePodOpen(podsArr[i])}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "380px",
            height: "115px",
            fontSize: "16px",
            justifyContent: "center",
            textAlign: "left",
            alignItems: "space-between",
            margin: "2px 0 0 0",
            padding: "5px 0px 0px 0px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            border:
              theme.palette.mode === "dark"
                ? "1.3px solid white"
                : "1.3px solid grey",
            borderRadius: "5px",
            boxShadow:
              theme.palette.mode === "dark"
                ? "10px 9px 2px #00000060"
                : "10px 10px 1px #00000000",
            background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "350px",
              margin: "30px 0 0 0",
            }}
          >
            <img
              style={{ width: "45px", marginLeft: "0px" }}
              src="./assets/container.png"
            ></img>
            <span
              style={{
                margin: "5px 0 0 15px",
                width: "250px",
                lineHeight: "23px",
                textTransform: "none",
                fontSize: "17px",
              }}
            >
              {tempContainerList[i]["name"]}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                alignItems: "flex-end",
                justifyContent: "right",
                margin: "0px 0px 0 28px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "15px",
                  backgroundColor: `${containerStatusColor}`,
                  justifyContent: "right",
                  margin: "0px 0 0px 0",
                }}
              ></div>
            </div>
          </div>
          {/*---------------------------------------------------------------- */}
          {/*                  beginng of row of stats below conatiner name   */}
          {/*---------------------------------------------------------------- */}
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              justifyContent: "left",
              alignItems: "flex-start",
              width: "100%",
              alignContent: "flex-end",
              padding: "0px 0px 0px 70px",
              margin: "5px 0px 0px 0px",
              fontSize: "15px",
            }}
          >
            <br />
            <div
              style={{
                flexDirection: "column",
                justifyContent: "left",
                textAlign: "left",
                width: "200px",
                fontSize: "11.5px",
                padding: "0px 0px 0 0px",
                fontWeight: "400",
                marginTop: "0px",
                lineHeight: "16px",
                textTransform: "none",
                opacity: ".5",
              }}
            >
              CPU USAGE: {tempContainerList[i]["cpuUsage"]}
              <br />
              MEMORY USAGE: {tempContainerList[i]["memoryUsage"]}
            </div>

            <div
              style={{
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                width: "70px",
                height: "70px",
                fontSize: "4",
                padding: "0px 0px 0px 0px",
                fontWeight: "400",
                marginRight: "18px",
                marginTop: "3px",
                marginBottom: "0px",
              }}
            >
              <div>
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "0px",
                    marginLeft: "10.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff40" : "#00000015",
                    width: "60px",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={
                    props.selectedPod[0]["podCpuLimit"] === "NONE"
                      ? 0
                      : ((100 *
                          Number(
                            tempContainerList[i]["cpuUsage"].slice(0, -1)
                          )) /
                          Number(`${props.selectedPod[0]["podCpuLimit"]}`)) *
                        0.73
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
                    left: "5.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark"
                        ? `${containerCpuPercentColor}`
                        : `${containerCpuPercentColorLight}`,

                    width: "60px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-43px",
                  left: "5px",
                  fontSize:
                    props.selectedPod[0]["podCpuLimit"] === "NONE"
                      ? "13px"
                      : "16px",
                  fontWeight: "500",
                  marginTop:
                    props.selectedPod[0]["podCpuLimit"] === "NONE"
                      ? "-55px"
                      : "-60px",
                  marginLeft: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${containerCpuPercentColor}`
                      : `${containerCpuPercentColorLight}`,
                }}
              >
                {props.selectedPod[0]["podCpuLimit"] === "NONE"
                  ? `no max`
                  : `${
                      (Number(tempContainerList[i]["cpuUsage"].slice(0, -1)) /
                        Number(props.selectedPod[0]["podCpuLimit"])) *
                      100
                    }%`}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  position: "relative",
                  top: "-43px",
                  left: "-1.5px",
                  marginRight: "-2px",
                  fontWeight: "500",
                  marginTop: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${containerCpuPercentColor}`
                      : `${containerCpuPercentColorLight}`,
                }}
              >
                CPU
              </div>
            </div>

            <div
              style={{
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                width: "70px",
                height: "40px",
                fontSize: "4",
                padding: "0px 0px 0 0px",
                fontWeight: "400",
                marginRight: "18px",
                marginTop: "3px",
              }}
            >
              <div>
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "0px",
                    marginLeft: "9.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff40" : "#00000015",
                    width: "60px",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={
                    props.selectedPod[0]["podMemoryLimit"] === "NONE"
                      ? 0
                      : Math.min(
                          73,
                          (73 *
                            Number(tempContainerList[i]["memoryUsageMath"])) /
                            Number(`${props.selectedPod[0]["podMemoryLimit"]}`)
                        )
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
                    left: "4.8px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark"
                        ? `${containerMemoryColor}`
                        : `${containerMemoryColorLight}`,
                    width: "60px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-43px",
                  left: "5px",
                  fontWeight: "500",
                  marginLeft: "-11px",
                  fontSize:
                    props.selectedPod[0]["podMemoryLimit"] === "NONE"
                      ? "13px"
                      : "16px",
                  marginTop:
                    props.selectedPod[0]["podMemoryLimit"] === "NONE"
                      ? "-55px"
                      : "-60px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${containerMemoryColor}`
                      : `${containerMemoryColorLight}`,
                }}
              >
                {props.selectedPod[0]["podMemoryLimit"] === "NONE"
                  ? `no max`
                  : `${Math.min(
                      Math.round(
                        100 *
                          (Number(tempContainerList[i]["memoryUsageMath"]) /
                            Number(props.selectedPod[0]["podMemoryLimit"])) *
                          10
                      ) / 10,

                      100
                    )}%`}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  position: "relative",
                  top: "-43px",
                  left: "-2.5px",
                  marginRight: "-2px",
                  fontWeight: "500",
                  marginTop: "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${containerMemoryColor}`
                      : `${containerMemoryColorLight}`,
                }}
              >
                MEMORY
              </div>
            </div>
          </span>
          {}
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let nodeListDiv;
  if (props.nodesArr[0]) {
    nodeListDiv = (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "-10px 0 0 68px",
            height: "34px",
            width: "250%",
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
                letterSpacing: "3px",
                textAlign: "left",
                paddingTop: "0px",
                color: theme.palette.mode === "dark" ? "" : "#6d6fb4",
                userSelect: "none",
              }}
            >
              NODES
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
              {" "}
              ( {nodeList.length} total )
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            margin: "0 0 0 68px",
            width: "171%",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "3000px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#ffffff99" : "#6d6fb4",
              marginTop: "0px",
            }}
          ></div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "-5px 0 0 50px",
          }}
        >
          {nodeList}
          <Modal
            open={openNode}
            onClose={handleNodeClose}
            style={{ overflow: "scroll", height: "100%" }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={openNodeModalStyle}>
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
                      src="./assets/node.svg"
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
                      }}
                    >
                      <div
                        style={{
                          fontSize: "38px",
                          fontWeight: "800",
                          letterSpacing: ".1px",
                          lineHeight: "40px",
                          padding: "30px 0 10px 10px",
                          width: "900px",
                        }}
                      >
                        {selectedNode[0]["name"]}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "right",
                          alignItems: "flex-end",
                          justifyContent: "right",
                          margin: "15px 15px 0 20px",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "15px",
                            backgroundColor: `${selectedNodeStatusColor}`,
                            justifyContent: "right",
                            margin: "0px 0 2px 0",
                          }}
                        ></div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "500",
                            color: `${selectedNodeStatusColor}`,
                          }}
                        ></div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "500",
                            margin: "-4px 0 0 0",
                            color: `${selectedNodeStatusColor}`,
                          }}
                        >
                          {selectedNode[0]["status"].toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        marginTop: "40px",
                      }}
                    >
                      <div
                        style={{
                          flexDirection: "column",
                          width: "300px",
                          color:
                            theme.palette.mode === "dark"
                              ? "#ffffff99"
                              : "darkpurple",
                          margin: "-10px 0 20px 0px",
                          fontSize: "17px",
                          fontWeight: "400",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            fontSize: "25px",
                            color:
                              theme.palette.mode === "dark"
                                ? "#ffffff"
                                : "white",
                            fontWeight: "500",
                            margin: "-20px 0 0px 0",
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "#7f78d8"
                                : "#928dd0",
                            padding: "2px 9px 1px 10px",
                            borderRadius: "3px",
                            width: `${selectedNode[0]["role"].length * 17.5}px`,
                            letterSpacing: ".5px",
                            userSelect: "none",
                          }}
                        >
                          {selectedNode[0]["role"].toUpperCase()}
                        </div>
                        <div
                          style={{
                            paddingLeft: "5px",
                            fontSize: "16px",
                            lineHeight: "27px",
                          }}
                        >
                          <br />
                          <b>AGE:</b> {" " + selectedNode[0]["age"]}
                          <br />
                          <b>VERSION:</b>
                          {" " + selectedNode[0]["version"]} <br />
                          <b>INTERNAL IP:</b>{" "}
                          {selectedNode[0]["internalIp"].toUpperCase()}
                          <br />
                          <b>EXTERNAL IP:</b>{" "}
                          {selectedNode[0]["externalIp"].toUpperCase()}
                          <br />
                          <b>OS IMAGE:</b>{" "}
                          {selectedNode[0]["osImage"].toUpperCase()}
                          <br />
                          <b>KERNAL VERSION:</b>
                          <br />
                          {" " + selectedNode[0]["kernal"]}
                          <br />
                          <b>CONTAINER RUNTIME:</b>
                          <br />
                          {" " + selectedNode[0]["containerRuntime"]}
                          <br />
                          <b>ROLE:</b>
                          {" " + selectedNode[0]["role"]}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "510px",
                          height: "240px",
                          margin: "5px 0 0 0",
                          // border: "1px solid white",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "510px",
                            margin: "20px 0 5px -25px",
                          }}
                        >
                          {" "}
                          CPU
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            width: "510px",
                          }}
                        >
                          <div
                            id="podCpuGaugeLarge"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: "-60px",
                              marginLeft: "-70px",
                              marginTop: "-50px",
                              transform: "scale(.55)",
                            }}
                          >
                            <CircularProgress
                              variant="determinate"
                              // @ts-nocheck
                              thickness={1.35}
                              value={100 * 0.73}
                              style={{
                                marginTop: "130px",
                                marginLeft: "53.5px",
                                rotate: "-131deg",
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#ffffff40"
                                    : "#00000015",
                                width: "180px",
                              }}
                            />
                            <CircularProgress
                              variant="determinate"
                              // @ts-nocheck
                              thickness={1.35}
                              value={
                                Number(
                                  `${selectedNode[0]["nodeCpuPercentMath"]}`
                                ) * 0.73
                              }
                              style={{
                                position: "relative",
                                top: "-40px",
                                left: "26.8px",
                                rotate: "-131deg",
                                color:
                                  selectedNode[0]["nodeCpuPercent"] === "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                                width: "180px",
                              }}
                            />
                            <div
                              style={{
                                position: "relative",
                                top: "-95px",
                                left: "0px",
                                fontSize:
                                  selectedNode[0]["nodeCpuPercentMath"] ===
                                  "N/A"
                                    ? "32px"
                                    : "42px",
                                fontWeight: "800",
                                marginTop:
                                  selectedNode[0]["nodeCpuLimit"] === "NONE"
                                    ? "-60px"
                                    : "-60px",
                                marginLeft: "-37px",
                                color:
                                  selectedNode[0]["nodeCpuPercentMath"] ===
                                    "N/A" && theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : selectedNode[0]["nodeCpuPercentMath"] ===
                                        "N/A" && theme.palette.mode !== "dark"
                                    ? "#00000050"
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {selectedNode[0]["nodeCpuPercentMath"] === "N/A"
                                ? `NO MAX`
                                : `${selectedNode[0]["nodeCpuPercentMath"]}%`}
                            </div>
                            <div
                              style={{
                                fontSize: "20px",
                                position: "relative",
                                top: "-99px",
                                left: "-21px",
                                marginRight: "-2px",
                                fontWeight: "400",
                                marginTop: "-8px",
                                color:
                                  selectedNode[0]["nodeCpuPercentMath"] ===
                                    "N/A" && theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : selectedNode[0]["nodeCpuPercentMath"] ===
                                        "N/A" && theme.palette.mode !== "dark"
                                    ? "#00000060"
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              CPU
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "120px",
                              margin: "0 30px 0 0",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  selectedNode[0]["nodeCpuLimit"] === "NONE"
                                    ? "28px"
                                    : "28px",
                                fontWeight: "700",
                                margin: "0px 0 -10px 0",
                                color:
                                  Number(
                                    selectedNode[0]["nodeCpuPercentMath"]
                                  ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {selectedNode[0]["nodeCpuUsed"]}m{" "}
                            </div>
                            <div
                              style={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : "#00000050",
                                fontSize: "12px",
                              }}
                            >
                              {" "}
                              CPU USED{" "}
                            </div>
                            <div
                              style={{
                                fontSize:
                                  selectedNode[0]["nodeCpuLimit"] === "NONE"
                                    ? "20px"
                                    : "28px",
                                fontWeight: "700",
                                margin:
                                  selectedNode[0]["nodeCpuLimit"] === "NONE"
                                    ? "6px 0 -8px 0"
                                    : "0px 0 -10px 0",
                                color:
                                  selectedNode[0]["nodeCpuLimit"] === "NONE" &&
                                  theme.palette.mode === "dark"
                                    ? "#ffffff70"
                                    : selectedNode[0]["nodeCpuLimit"] ===
                                        "NONE" && theme.palette.mode !== "dark"
                                    ? "#00000040"
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0]["nodeCpuPercentMath"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {selectedNode[0]["nodeCpuLimit"] === "NONE"
                                ? "NONE"
                                : `${selectedNode[0]["nodeCpuLimit"]}m`}{" "}
                            </div>
                            <div
                              style={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : "#00000050",
                                fontSize: "12px",
                              }}
                            >
                              {" "}
                              CPU LIMIT{" "}
                            </div>
                          </div>

                          <LightTooltip
                            title="CPU USAGE OVER TIME - CLICK TO EXPAND"
                            placement="top"
                            arrow
                            enterDelay={1000}
                            leaveDelay={100}
                            enterNextDelay={3000}
                          >
                            <div
                              onClick={handleNodeCpuChartOpen}
                              style={{
                                display: "flex",
                                borderRadius: "15px",
                                height: "93px",
                                border:
                                  theme.palette.mode === "dark"
                                    ? "1.5px solid #ffffff50"
                                    : "1.5px solid #00000030",
                              }}
                            >
                              <NodeCpuChart
                                width={230}
                                height={90}
                                selectedNode={selectedNode}
                                nodesStatsObj={props.nodesStatsObj}
                              />
                            </div>
                          </LightTooltip>
                          <Modal
                            open={showExpandedNodeCpuChart}
                            onClose={handleNodeCpuChartClose}
                          >
                            <Box sx={chartStyle}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  fontFamily: "Outfit",
                                  fontSize: "24px",
                                  fontWeight: "700",
                                  textAlign: "center",
                                  margin: "10px 0 0px 0",
                                }}
                              >
                                {selectedNode[0]["name"].toUpperCase()} - CPU
                                USAGE - GRAPH OVER TIME
                                <div
                                  style={{
                                    margin: "20px 0 0px 0",
                                    fontWeight: "500",
                                    borderRadius: "15px",
                                    border:
                                      theme.palette.mode === "dark"
                                        ? "1.5px solid #ffffff50"
                                        : "1.5px solid #00000030",
                                  }}
                                >
                                  <NodeCpuChart
                                    width={840}
                                    height={400}
                                    selectedNode={selectedNode}
                                    nodesStatsObj={props.nodesStatsObj}
                                  />
                                </div>
                              </div>
                            </Box>
                          </Modal>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "510px",
                            margin: "-56px 0 1px -25px",
                          }}
                        >
                          {" "}
                          MEMORY
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            width: "510px",
                          }}
                        >
                          <div
                            id="podMemoryGaugeLarge"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: "-60px",
                              marginLeft: "-70px",
                              marginTop: "-50px",
                              transform: "scale(.55)",
                            }}
                          >
                            <CircularProgress
                              variant="determinate"
                              // @ts-nocheck
                              thickness={1.35}
                              value={100 * 0.73}
                              style={{
                                marginTop: "130px",
                                marginLeft: "53.5px",
                                rotate: "-131deg",
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#ffffff40"
                                    : "#00000015",
                                width: "180px",
                              }}
                            />
                            <CircularProgress
                              variant="determinate"
                              // @ts-nocheck
                              thickness={1.35}
                              value={
                                Number(
                                  `${selectedNode[0]["nodeMemoryPercent"].slice(
                                    0,
                                    -1
                                  )}`
                                ) * 0.73
                              }
                              style={{
                                position: "relative",
                                top: "-40px",
                                left: "26.8px",
                                rotate: "-131deg",
                                color:
                                  selectedNode[0]["nodeMemoryPercent"] === "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                                width: "180px",
                              }}
                            />
                            <div
                              style={{
                                position: "relative",
                                top: "-95px",
                                left: "0px",
                                fontSize:
                                  selectedNode[0]["nodeMemoryPercent"] === "N/A"
                                    ? "32px"
                                    : "42px",
                                fontWeight: "800",
                                marginTop:
                                  selectedNode[0]["nodeMemoryPercent"] === "N/A"
                                    ? "-50px"
                                    : "-60px",
                                marginLeft: "-37px",
                                color:
                                  selectedNode[0]["nodeMemoryPercent"] ===
                                    "N/A" && theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : selectedNode[0]["nodeMemoryPercent"] ===
                                        "N/A" && theme.palette.mode !== "dark"
                                    ? "#00000050"
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {selectedNode[0]["nodeMemoryPercent"] === "N/A"
                                ? `NO MAX`
                                : `${selectedNode[0]["nodeMemoryPercent"].slice(
                                    0,
                                    -1
                                  )}%`}
                            </div>
                            <div
                              style={{
                                fontSize: "20px",
                                position: "relative",
                                top: "-99px",
                                left: "-21px",
                                marginRight: "-2px",
                                fontWeight: "400",
                                marginTop: "-8px",
                                color:
                                  selectedNode[0]["nodeMemoryPercent"] ===
                                    "N/A" && theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : selectedNode[0]["nodeMemoryPercent"] ===
                                        "N/A" && theme.palette.mode !== "dark"
                                    ? "#00000060"
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              MEMORY
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "120px",
                              // border: "1px solid white",
                              margin: "0 30px 0 0",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  selectedNode[0]["nodeMemoryLimit"] === "NONE"
                                    ? "28px"
                                    : "28px",
                                fontWeight: "700",
                                margin: "0px 0 -10px 0",
                                color:
                                  selectedNode[0]["nodeMemoryPercent"] === "N/A"
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0][
                                          "nodedMemoryPercent"
                                        ].slice(0, -1)
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {selectedNode[0]["nodeMemoryUsedDisplay"]}{" "}
                            </div>
                            <div
                              style={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : "#00000050",
                                fontSize: "12px",
                              }}
                            >
                              {" "}
                              MEM USED{" "}
                            </div>
                            <div
                              style={{
                                fontSize:
                                  selectedNode[0]["nodeMemoryLimit"] === "NONE"
                                    ? "20px"
                                    : "28px",
                                fontWeight: "700",
                                margin:
                                  selectedNode[0]["nodeMemoryLimit"] === "NONE"
                                    ? "6px 0 -8px 0"
                                    : "0px 0 -10px 0",
                                color:
                                  selectedNode[0]["nodeMemoryLimit"] ===
                                    "NONE" && theme.palette.mode === "dark"
                                    ? "#ffffff70"
                                    : selectedNode[0]["nodeMemoryLimit"] ===
                                        "NONE" && theme.palette.mode !== "dark"
                                    ? "#00000040"
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        selectedNode[0][
                                          "nodeMemoryPercent"
                                        ].slice(0, -1)
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {selectedNode[0]["nodeMemoryLimit"] === ""
                                ? "NONE"
                                : selectedNode[0]["nodeMemoryLimit"]}{" "}
                            </div>
                            <div
                              style={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "#ffffff80"
                                    : "#00000050",
                                fontSize: "12px",
                              }}
                            >
                              {" "}
                              MEM LIMIT{" "}
                            </div>
                          </div>
                          <LightTooltip
                            title="MEMORY USAGE OVER TIME - CLICK TO EXPAND"
                            placement="top"
                            arrow
                            enterDelay={1000}
                            leaveDelay={100}
                            enterNextDelay={3000}
                          >
                            <div
                              onClick={handleNodeMemoryChartOpen}
                              style={{
                                display: "flex",
                                borderRadius: "15px",
                                height: "93px",
                                border:
                                  theme.palette.mode === "dark"
                                    ? "1.5px solid #ffffff50"
                                    : "1.5px solid #00000030",
                              }}
                            >
                              <NodeMemoryChart
                                width={230}
                                height={90}
                                nodesStatsObj={props.nodesStatsObj}
                                selectedNode={selectedNode}
                              />
                            </div>
                          </LightTooltip>
                          <Modal
                            open={showExpandedNodeMemoryChart}
                            onClose={handleNodeMemoryChartClose}
                          >
                            <Box sx={chartStyle}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  fontFamily: "Outfit",
                                  fontSize: "24px",
                                  fontWeight: "700",
                                  textAlign: "center",
                                  margin: "10px 0 0px 0",
                                }}
                              >
                                {selectedNode[0]["name"].toUpperCase()} - MEMORY
                                USAGE - GRAPH OVER TIME
                                <div
                                  style={{
                                    margin: "20px 0 0px 0",
                                    borderRadius: "15px",
                                    fontWeight: "500",
                                    border:
                                      theme.palette.mode === "dark"
                                        ? "1.5px solid #ffffff50"
                                        : "1.5px solid #00000030",
                                  }}
                                >
                                  <NodeMemoryChart
                                    width={840}
                                    height={400}
                                    selectedNode={selectedNode}
                                    nodesStatsObj={props.nodesStatsObj}
                                  />
                                </div>
                              </div>
                            </Box>
                          </Modal>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: "20px 0 0 0px",
                        width: "100%",
                      }}
                    >
                      <button
                        className="button3D-pushable"
                        role="button"
                        onClick={handleNodeYamlOpen}
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
                            width: "250px",
                            background:
                              theme.palette.mode === "dark"
                                ? "hsl(239, 38%, 51%)"
                                : "hsl(263, 65%, 80%)",
                          }}
                        >
                          VIEW NODE YAML
                        </span>
                      </button>
                      <Modal open={openNodeYaml} onClose={handleNodeYamlClose}>
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
                            NODE YAML
                          </div>
                          {nodeYaml}
                        </Box>
                      </Modal>

                      <button
                        className="button3D-pushable"
                        role="button"
                        onClick={handleNodeDescribeOpen}
                        style={{ margin: "0 10px 0 10px" }}
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
                            width: "250px",
                            background:
                              theme.palette.mode === "dark"
                                ? "hsl(239, 38%, 51%)"
                                : "hsl(263, 65%, 80%)",
                          }}
                        >
                          DESCRIBE NODE
                        </span>
                      </button>
                      <Modal
                        open={openNodeDescribe}
                        onClose={handleNodeDescribeClose}
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
                            NODE DESCRIBE
                          </div>
                          {nodeDescribe}
                        </Box>
                      </Modal>

                      <button
                        className="button3D-pushable"
                        role="button"
                        onClick={handleNodeDrainOpen}
                        style={{ margin: "0 0px 0 10px" }}
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
                            width: "250px",
                            background:
                              theme.palette.mode === "dark"
                                ? "hsl(239, 38%, 51%)"
                                : "hsl(263, 65%, 80%)",
                          }}
                        >
                          DRAIN NODE
                        </span>
                      </button>
                      <Modal
                        open={openNodeDrain}
                        onClose={handleNodeDrainClose}
                        style={{ overflow: "scroll", height: "100%" }}
                      >
                        <Box sx={nodeDrainStyle}>
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "18px",
                              fontWeight: "900",
                              paddingTop: "20px",
                            }}
                          >
                            ARE YOU SURE YOU WANT DRAIN THIS NODE?
                          </div>
                          <div
                            style={{
                              padding: "10px 40px 0 40px",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Please note: This will safely evict all of your pods
                            from a node before you perform maintenance on the
                            node (e.g. kernel upgrade, hardware maintenance,
                            etc.). Safe evictions allow the pod's containers to
                            gracefully terminate and will respect the
                            PodDisruptionBudgets you have specified.
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
                              onClick={handleNodeDrain}
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
                                  width: "150px",
                                  background:
                                    theme.palette.mode === "dark"
                                      ? "hsl(239, 38%, 51%)"
                                      : "hsl(263, 65%, 80%)",
                                }}
                              >
                                DRAIN NODE
                              </span>
                            </button>

                            <button
                              className="button3D-pushable"
                              role="button"
                              onClick={handleNodeDrainClose}
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
                        onClick={handleNodeCordonOpen}
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
                            width: "250px",
                            background:
                              theme.palette.mode === "dark"
                                ? "hsl(239, 38%, 51%)"
                                : "hsl(263, 65%, 80%)",
                          }}
                        >
                          CORDON NODE
                        </span>
                      </button>
                      <Modal
                        open={openNodeCordon}
                        onClose={handleNodeCordonClose}
                        style={{ overflow: "scroll", height: "100%" }}
                      >
                        <Box sx={nodeCordonStyle}>
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "18px",
                              fontWeight: "900",
                              paddingTop: "20px",
                            }}
                          >
                            ARE YOU SURE YOU WANT CORDON THIS NODE?
                          </div>
                          <div
                            style={{
                              padding: "10px 40px 0 40px",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Please note: Cordoning a node will mark it as
                            unschedulable.
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
                              onClick={handleNodeCordon}
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
                                  width: "160px",
                                  background:
                                    theme.palette.mode === "dark"
                                      ? "hsl(239, 38%, 51%)"
                                      : "hsl(263, 65%, 80%)",
                                }}
                              >
                                CORDON NODE
                              </span>
                            </button>

                            <button
                              className="button3D-pushable"
                              role="button"
                              onClick={handleNodeCordonClose}
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
                        onClick={handleNodeUncordonOpen}
                        style={{ margin: "0 10px 0 10px" }}
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
                            width: "250px",
                            background:
                              theme.palette.mode === "dark"
                                ? "hsl(239, 38%, 51%)"
                                : "hsl(263, 65%, 80%)",
                          }}
                        >
                          UNCORDON NODE
                        </span>
                      </button>
                      <Modal
                        open={openNodeUncordon}
                        onClose={handleNodeUncordonClose}
                        style={{ overflow: "scroll", height: "100%" }}
                      >
                        <Box sx={nodeUncordonStyle}>
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "18px",
                              fontWeight: "900",
                              paddingTop: "20px",
                            }}
                          >
                            ARE YOU SURE YOU WANT UNCORDON THIS NODE?
                          </div>
                          <div
                            style={{
                              padding: "10px 40px 0 40px",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Please note: Uncordoning a node will mark it as
                            schedulable.
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
                              onClick={handleNodeUncordon}
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
                                  width: "175px",
                                  background:
                                    theme.palette.mode === "dark"
                                      ? "hsl(239, 38%, 51%)"
                                      : "hsl(263, 65%, 80%)",
                                }}
                              >
                                UNCORDON NODE
                              </span>
                            </button>

                            <button
                              className="button3D-pushable"
                              role="button"
                              onClick={handleNodeUncordonClose}
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
                        onClick={handleNodeDeleteOpen}
                        style={{ margin: "0 10px 0 10px" }}
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
                            width: "250px",
                            background:
                              theme.palette.mode === "dark"
                                ? "hsl(239, 38%, 51%)"
                                : "hsl(263, 65%, 80%)",
                          }}
                        >
                          DELETE / RESTART NODE
                        </span>
                      </button>
                      <Modal
                        open={openNodeDelete}
                        onClose={handleNodeDeleteClose}
                        style={{ overflow: "scroll", height: "100%" }}
                      >
                        <Box sx={nodeDeleteStyle}>
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
                            Please note: if this node is scheduled to be
                            running, then a new version will replace it after
                            termination.
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
                              onClick={handleNodeDelete}
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
                                  width: "150px",
                                  background:
                                    theme.palette.mode === "dark"
                                      ? "hsl(239, 38%, 51%)"
                                      : "hsl(263, 65%, 80%)",
                                }}
                              >
                                DELETE NODE
                              </span>
                            </button>

                            <button
                              className="button3D-pushable"
                              role="button"
                              onClick={handleNodeDeleteClose}
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

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                        margin: "20px 0 0 0px",
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
                        NODE'S PODS
                      </div>
                      <div
                        style={{
                          margin: "0px 0 2px 10px",
                          userSelect: "none",
                        }}
                      >
                        ({tempPodList.length} total)
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        margin: "0 0 0 0px",
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
                        flexWrap: "wrap",
                        margin: "0 0 0 0px",
                      }}
                    >
                      {nodesPodsList}
                    </div>
                    <Modal
                      open={props.openPod}
                      onClose={handlePodClose}
                      style={{ overflow: "scroll", height: "100%" }}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={openPodModalStyle}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
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
                                src="./assets/pod.svg"
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
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "38px",
                                    fontWeight: "800",
                                    letterSpacing: ".1px",
                                    lineHeight: "40px",
                                    padding: "10px 0 10px 10px",
                                    width: "900px",
                                  }}
                                >
                                  {props.selectedPod[0]["name"]}
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    textAlign: "right",
                                    alignItems: "flex-end",
                                    justifyContent: "right",
                                    margin: "15px 15px 0 20px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      borderRadius: "15px",
                                      backgroundColor: `${props.selectedPodStatusColor}`,
                                      justifyContent: "right",
                                      margin: "0px 0 2px 0",
                                    }}
                                  ></div>
                                  <div
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "500",
                                      color: `${props.selectedPodStatusColor}`,
                                    }}
                                  >
                                    {props.selectedPod[0][
                                      "ready"
                                    ].toUpperCase()}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "500",
                                      margin: "-4px 0 0 0",
                                      color: `${props.selectedPodStatusColor}`,
                                    }}
                                  >
                                    {props.selectedPod[0][
                                      "status"
                                    ].toUpperCase()}
                                  </div>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  width: "100%",
                                  marginTop: "40px",
                                }}
                              >
                                <div
                                  style={{
                                    flexDirection: "column",
                                    width: "300px",
                                    color:
                                      theme.palette.mode === "dark"
                                        ? "#ffffff99"
                                        : "darkpurple",
                                    margin: "-10px 0 20px 0px",
                                    fontSize: "17px",
                                    fontWeight: "200",
                                  }}
                                >
                                  <div style={{ paddingLeft: "5px" }}>
                                    <br />
                                    <div style={{ fontSize: "20px" }}>
                                      <b>
                                        NODE:{" "}
                                        {" " + props.selectedPod[0]["node"]}
                                        <br />
                                        NAMESPACE:
                                        {" " +
                                          props.selectedPod[0][
                                            "namespace"
                                          ]}{" "}
                                      </b>
                                      <br />
                                    </div>
                                    <b>RESTARTS:</b>{" "}
                                    {props.selectedPod[0][
                                      "restarts"
                                    ].toUpperCase()}
                                    <br />
                                    <b>LAST RESTART:</b>{" "}
                                    {props.selectedPod[0][
                                      "lastRestart"
                                    ].toUpperCase()}
                                    <br />
                                    <b>AGE:</b>{" "}
                                    {props.selectedPod[0]["age"].toUpperCase()}
                                    <br />
                                    <b>IP ADDRESS:</b>
                                    {" " + props.selectedPod[0]["ipAddress"]}
                                    <br />
                                    <b>NOMINATED NODE:</b>
                                    {" " +
                                      props.selectedPod[0]["nominatedNode"]}
                                    <br />
                                    <b>READINESS GATES:</b>
                                    {" " +
                                      props.selectedPod[0]["readinessGates"]}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: "35px",
                                    marginLeft: "5px",
                                  }}
                                >
                                  <CircularProgress
                                    variant="determinate"
                                    // @ts-nocheck
                                    thickness={1.35}
                                    value={100 * 0.73}
                                    style={{
                                      marginTop: "130px",
                                      marginLeft: "53.5px",
                                      rotate: "-131deg",
                                      color:
                                        theme.palette.mode === "dark"
                                          ? "#ffffff40"
                                          : "#00000015",
                                      width: "180px",
                                    }}
                                  />
                                  <CircularProgress
                                    variant="determinate"
                                    // @ts-nocheck
                                    thickness={1.35}
                                    value={
                                      props.selectedPod[0]["podCpuLimit"] ===
                                      "NONE"
                                        ? 0
                                        : Number(
                                            `${props.selectedPod[0]["podCpuPercent"]}`
                                          ) * 0.73
                                    }
                                    style={{
                                      position: "relative",
                                      top: "-40px",
                                      left: "26.8px",
                                      rotate: "-131deg",
                                      color:
                                        props.selectedPod[0][
                                          "podCpuPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                      width: "180px",
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: "relative",
                                      top: "-95px",
                                      left: "0px",
                                      fontSize:
                                        props.selectedPod[0][
                                          "podCpuPercent"
                                        ] === "N/A"
                                          ? "36px"
                                          : "38px",
                                      fontWeight: "800",
                                      marginTop: "-60px",
                                      marginLeft: "-37px",
                                      color:
                                        props.selectedPod[0][
                                          "podCpuPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                    }}
                                  >
                                    {props.selectedPod[0]["podCpuPercent"] ===
                                    "N/A"
                                      ? `NO MAX`
                                      : `${props.selectedPod[0]["podCpuPercent"]}%`}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "16px",
                                      position: "relative",
                                      top: "-99px",
                                      left: "-21px",

                                      marginRight: "-2px",
                                      fontWeight: "400",
                                      marginTop: "-8px",
                                      color:
                                        props.selectedPod[0][
                                          "podCpuPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                    }}
                                  >
                                    CPU
                                  </div>
                                  <div
                                    style={{
                                      position: "relative",
                                      top: -42,
                                      left: -19,
                                      fontWeight: "400",
                                      fontSize: "16px",
                                      textAlign: "center",
                                      color:
                                        props.selectedPod[0][
                                          "podCpuPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podCpuPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                    }}
                                  >
                                    {" "}
                                    CPU USED:{" "}
                                    <strong>
                                      {props.selectedPod[0][
                                        "podCpuUsed"
                                      ].toUpperCase()}
                                      m
                                    </strong>
                                    <br />
                                    CPU LIMIT:{" "}
                                    <strong>
                                      {props.selectedPod[0][
                                        "podCpuLimit"
                                      ].toUpperCase()}
                                      m
                                    </strong>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <CircularProgress
                                    variant="determinate"
                                    // @ts-nocheck
                                    thickness={1.35}
                                    value={100 * 0.73}
                                    style={{
                                      marginTop: "130px",
                                      marginLeft: "53.5px",
                                      rotate: "-131deg",
                                      color:
                                        theme.palette.mode === "dark"
                                          ? "#ffffff40"
                                          : "#00000015",
                                      width: "180px",
                                    }}
                                  />
                                  <CircularProgress
                                    variant="determinate"
                                    // @ts-nocheck
                                    thickness={1.35}
                                    value={
                                      props.selectedPod[0]["podMemoryLimit"] ===
                                      "NONE"
                                        ? 0
                                        : Number(
                                            `${props.selectedPod[0]["podMemoryPercent"]}`
                                          ) * 0.73
                                    }
                                    style={{
                                      position: "relative",
                                      top: "-40px",
                                      left: "26.8px",
                                      rotate: "-131deg",
                                      color:
                                        props.selectedPod[0][
                                          "podMemoryPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                      width: "180px",
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: "relative",
                                      top: "-95px",
                                      left: "0px",
                                      fontSize:
                                        props.selectedPod[0][
                                          "podMemoryPercent"
                                        ] === "N/A"
                                          ? "36px"
                                          : "38px",
                                      fontWeight: "800",
                                      marginTop: "-60px",
                                      marginLeft: "-37px",
                                      color:
                                        props.selectedPod[0][
                                          "podMemoryPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                    }}
                                  >
                                    {props.selectedPod[0][
                                      "podMemoryPercent"
                                    ] === "N/A"
                                      ? `NO MAX`
                                      : `${props.selectedPod[0]["podMemoryPercent"]}%`}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "16px",
                                      position: "relative",
                                      top: "-99px",
                                      left: "-20px",
                                      marginRight: "-2px",
                                      fontWeight: "400",
                                      marginTop: "-8px",
                                      color:
                                        props.selectedPod[0][
                                          "podMemoryPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                    }}
                                  >
                                    MEMORY
                                  </div>
                                  <div
                                    style={{
                                      position: "relative",
                                      top: -42,
                                      left: -19,
                                      fontWeight: "400",
                                      fontSize: "16px",
                                      textAlign: "center",
                                      color:
                                        props.selectedPod[0][
                                          "podMemoryPercent"
                                        ] === "N/A"
                                          ? "#ffffff80"
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) < 90
                                          ? `#2fc665`
                                          : Number(
                                              props.selectedPod[0][
                                                "podMemoryPercent"
                                              ]
                                            ) > 90
                                          ? "#cf4848"
                                          : "yellow",
                                    }}
                                  >
                                    {" "}
                                    MEM. USED:{" "}
                                    <strong>
                                      {
                                        props.selectedPod[0][
                                          "podMemoryUsedDisplay"
                                        ]
                                      }
                                    </strong>
                                    <br />
                                    MEM. LIMIT:{" "}
                                    <strong>
                                      {
                                        props.selectedPod[0][
                                          "podMemoryLimitDisplay"
                                        ]
                                      }
                                    </strong>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  margin: "0 0 0 0px",
                                }}
                              >
                                <button
                                  className="button3D-pushable"
                                  role="button"
                                  onClick={handlePodLogOpen}
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
                                      width: "250px",
                                      background:
                                        theme.palette.mode === "dark"
                                          ? "hsl(239, 38%, 51%)"
                                          : "hsl(263, 65%, 80%)",
                                    }}
                                  >
                                    VIEW LOGS
                                  </span>
                                </button>
                                <Modal
                                  open={props.openPodLog}
                                  onClose={handlePodLogClose}
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
                                      POD LOGS
                                    </div>
                                    {props.podLogs}
                                  </Box>
                                </Modal>

                                <button
                                  className="button3D-pushable"
                                  role="button"
                                  onClick={handlePodYamlOpen}
                                  style={{ margin: "0 10px 0 10px" }}
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
                                      width: "250px",
                                      background:
                                        theme.palette.mode === "dark"
                                          ? "hsl(239, 38%, 51%)"
                                          : "hsl(263, 65%, 80%)",
                                    }}
                                  >
                                    VIEW POD YAML
                                  </span>
                                </button>
                                <Modal
                                  open={props.openPodYaml}
                                  onClose={handlePodYamlClose}
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
                                      POD YAML
                                    </div>
                                    {props.podYaml}
                                  </Box>
                                </Modal>

                                <button
                                  className="button3D-pushable"
                                  role="button"
                                  onClick={handlePodDeleteOpen}
                                  style={{ margin: "0 0px 0 10px" }}
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
                                      width: "250px",
                                      background:
                                        theme.palette.mode === "dark"
                                          ? "hsl(239, 38%, 51%)"
                                          : "hsl(263, 65%, 80%)",
                                    }}
                                  >
                                    DELETE / RESTART POD
                                  </span>
                                </button>
                                <Modal
                                  open={props.openPodDelete}
                                  onClose={handlePodDeleteClose}
                                  style={{ overflow: "scroll", height: "100%" }}
                                >
                                  <Box sx={podDeleteStyle}>
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
                                      Please note: if this pod is scheduled to
                                      be running, then a new version will
                                      replace it after termination.
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
                                        onClick={handlePodDelete}
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
                                            width: "150px",
                                            background:
                                              theme.palette.mode === "dark"
                                                ? "hsl(239, 38%, 51%)"
                                                : "hsl(263, 65%, 80%)",
                                          }}
                                        >
                                          DELETE POD
                                        </span>
                                      </button>

                                      <button
                                        className="button3D-pushable"
                                        role="button"
                                        onClick={handlePodDeleteClose}
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
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-end",
                                  margin: "50px 0 0 0px",
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
                                  }}
                                >
                                  POD'S CONTAINERS
                                </div>
                                <div
                                  style={{
                                    margin: "0px 0 2px 10px",
                                    color: `${props.selectedPodStatusColor}`,
                                  }}
                                >
                                  ({props.selectedPod[0]["ready"]}{" "}
                                  {props.selectedPod[0]["status"]})
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  margin: "0 0 0 0px",
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
                                  flexWrap: "wrap",
                                  margin: "0 0 0 0px",
                                }}
                              >
                                {podContainerList}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
        <div style={{ height: "20px" }}></div>
      </>
    );
  }


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
          marginTop: "-16px",
          marginBottom: "0px",
          textAlign: "center",
          width: "95.5%",
        }}
      >
        <div>{nodeListDiv}</div>
      </div>
    </>
  );
}

export default KraneNodeList;
