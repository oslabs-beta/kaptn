import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, useTheme, Box, Modal, Checkbox } from "@mui/material";
const { ipcRenderer } = require("electron");
import SideNav from "./Sidebar.js";
import LaunchIcon from "@mui/icons-material/Launch";
import { RadioButtonUnchecked } from "@mui/icons-material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { styled } from "@mui/material/styles";
import { JsxElement } from "typescript";
import SortIcon from "@mui/icons-material/Sort";

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

// let filteredPods: any = [];

function KraneNodeList(props) {
  const [openNode, setOpenNode] = React.useState(false);

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

  const theme = useTheme();

  let currDir = "NONE SELECTED";
  let filteredNodes = [];

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
    mt: 0.8,
    border:
      theme.palette.mode === "dark" ? "1px solid white" : "2px solid #9075ea",
    borderRadius: "10px",
    overflow: "scroll",
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

  function handleClick(event) {
    // setPodsArr(filteredPods);
    // console.log("launch is", launch);
    // console.log("podsArr IN HANDLECLICK FOR LAUNCH is", podsArr);
    props.getNodesInfo();
  } // ---------------------- end of handle click function to refresh pods

  const handleNodeOpen = (node) => {
    if (node["status"] === "Ready") {
      setSelectedNodeStatusColor("#2fc665");
    } else {
      setSelectedNodeStatusColor("rgba(210, 223, 61)");
    }
    setSelectedNode([node]);
    // console.log("selected pod is ", pod);

    // console.log(
    //   `selectedNode[0]["podCpuPercent"] is`,
    //   selectedNode[0]["podCpuPercent"]
    // );
    if (typeof selectedNode[0]["podCpuPercent"] === "string") {
      if (selectedNode[0]["podCpuPercent"] === "N/A") {
        setSelectedNodeCPUColor("#ffffff80");
      }
    } else if (selectedNode[0]["podCpuPercent"] < 90) {
      setSelectedNodeCPUColor("#2fc665");
    } else {
      setSelectedNodeCPUColor("#cf4848");
    }
    // console.log(pod);

    // console.log(selectedNodeStatusColor);
    // if (podsArr[i]["status"] === "Running") {
    //   readyStatusRunning = "#2fc665";
    // } else {
    //   readyStatusRunning = "rgba(210, 223, 61)";
    // }

    setOpenNode(true);

    // console.log("selectedNodeCpuColor is", selectedNodeCPUColor);
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

    let i: number = 145;
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
        // if (arg[i] !== " " && arg[i + 1] !== " ") {
        osImageOutput.push(arg[i]);
        // console.log("osImageOutput is", osImageOutput);
        // }
        i++;
      }
      if (osImageOutput[osImageOutput.length - 1] === " ") {
        osImageOutput.pop();
      }

      // while (arg[i] === " ") {
      //   osImageOutput.push(arg[i]);
      //   i++;
      // }

      // while (arg[i] !== " ") {
      //   // if (arg[i] !== " " && arg[i + 1] !== " ") {
      //   osImageOutput.push(arg[i]);
      //   // }
      //   i++;
      // }

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
      // console.log("NODE IS", node);

      filteredNodes.push(node);
      j++;
      // console.log("arg Arr is", argArr);
    } // ---------- end of for loop

    let finalNodesInfoArr = filteredNodes.filter(
      (ele: any, ind: number) =>
        ind ===
        filteredNodes.findIndex(
          (elem) => elem.name === ele.name && elem.role === ele.role
        )
    );
    filteredNodes = finalNodesInfoArr;
    // console.log(" filtered NODES is", filteredNodes);
    props.setNodesArr([...filteredNodes]);
    // console.log(" Nodes Arr is", nodesArr);
  }); // ------------------------------------------ end of ipc render for get nodes command

  //Listen to "get cpuUsed" return event
  ipcRenderer.on("got_nodesCpuUsed", (event, arg) => {
    // console.log("ARG ISSSSSS", arg);
    let argArr = arg.split("");
    // console.log("arg arr is", argArr);

    let nodeUsageArray = [];

    let i: number = 0;

    //skips row of column titles
    while (argArr[i] !== "\n") {
      i++;
    }
    i++;

    // //for loop to put all pods in array of objects
    for (let j = 0; i < argArr.length; i++) {
      let nodeNameArr = [];
      let nodeCpuUsedArr = [];
      let nodeCpuPercentArr = [];
      let nodeMemoryUsedArr = [];
      let nodeMemoryPercentArr = [];

      //saves name because array order is same for both outputs
      while (argArr[i] !== " ") {
        nodeNameArr.push(arg[i]);
        i++;
      }
      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }
      //   // //save cpu(cores) to array to parse at end of loops
      // console.log("ARG ARR at i is", argArr[i]);
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
      // console.log("node mem arr is", nodeMemoryUsedDisplay);

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

      // console.log(" podCpuUsedArr is ", podCpuUsedArr);
      // console.log(" podMemoryUsedArr is ", podMemoryUsedArr);
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
      // console.log("arg at i is", arg[i]);
      // console.log("I is", i);
      // console.log("node cpu is", nodeMemoryUsedArr.join(""));
      // console.log("after used values i is", i, "and arg i is", arg[i]);
      // console.log(" NODE IS ", node);
      nodeUsageArray.push(node);

      // console.log(" NODE USAGE ARR IS ", nodeUsageArray);
    } //end of for loop

    let finalNodeUsageArr = nodeUsageArray.filter(
      (ele: any, ind: number) =>
        ind ===
        nodeUsageArray.findIndex((elem) => elem.nodeName === ele.nodeName)
    );

    for (let j = 0; j < finalNodeUsageArr.length; j++) {
      // console.log(
      //   `filteredNodes[j]["nodeCpuUsed"] is`,
      //   filteredNodes[j]["nodeCpuUsed"]
      // );
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
    // console.log(" FILTERD Nodes AFTER USAGE FETCH IS ", filteredNodes);

    props.setNodesArr([...filteredNodes]);
  });

  //
  //Listen to "get nodeCpuUsed" return event
  ipcRenderer.on("got_nodesCpuLimits", (event, arg) => {
    // console.log("ARG ISSSSSS", arg);
    let argArr = arg.split("");
    // console.log("arg arr is", argArr);
    let nodeLimitsArray = [];

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
      let nodeCpuLimitsArr = [];
      let nodeMemoryLimitsArr = [];
      let nodeNameArr = [];

      //take name because maybe be duplicate values]
      while (argArr[i] !== " ") {
        nodeNameArr.push(argArr[i]);
        i++;
      }
      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }

      // console.log("I IS:", i, " .... ARG ARRAY AT I IS:", argArr[i]);
      if (argArr[i] === "<") {
        nodeCpuLimitsArr = ["N", "O", "N", "E"];
        i += 7;
      } else {
        //   //   // //save cpu-limits to array to parse at end of loops
        //   console.log("ARG ARR at i is", argArr[i]);
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
        // console.log("podCpuLimitsArr is", podCpuLimitsArr);
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
        // console.log("podMemoryLimitsArr is", podMemoryLimitsArr);
      }

      //   //join used values and add them to object
      node = {
        nodeName: nodeNameArr.join(""),
        nodeCpuLimit: nodeCpuLimitsArr.join(""),
        nodeMemoryLimit: nodeMemoryLimitsArr.join(""),
      };

      j++;
      //   // console.log("after used values i is", i, "and arg i is", arg[i]);
      // console.log(" POD IS ", pod);
      nodeLimitsArray.push(node);

      // console.log("NODE FROM LIMITS is", node);
      node = {};
      // console.log("arg arr is", argArr);
      // console.log("arg at i is", arg[i]);
      // console.log("i is", i);
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
  });

  useEffect(() => {
    // ----------------------------------------- get NODES section ------------
    props.getNodesInfo();
  }, []);

  //-----------------------------------------------------------START OF FOR LOOP TO PUSH NODE LIST JSX

  let nodeList = [];
  console.log("nodes arr is:", props.nodesArr);
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

    // if (nodesArr[i]["nodeCpuLimit"] === "NONE") {
    //   nodeCpuPercentColor = "#ffffff80";
    //   nodeCpuPercentColorLight = "#00000040";
    // } else
    if (props.nodesArr[i]["nodeCpuPercentMath"] < 90) {
      nodeCpuPercentColor = "#2fc665";
      nodeCpuPercentColorLight = "#5bb57b";
    } else {
      nodeCpuPercentColor = "#cf4848";
      nodeCpuPercentColorLight = "#d35656";
    }

    // console.log("color is", nodeCpuPercentColorLight);

    // if (nodesArr[i]["nodeMemoryPercent"] === "N/A") {
    //   nodeMemoryPercentColor = "#ffffff80";
    //   nodeMemoryPercentColorLight = "#00000040";
    // } else
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
            // border: "1px solid white",
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
              // border: "1px solid green",
            }}
          >
            <img
              style={{
                width: "40px",
                marginRight: "0px",
                marginLeft: "10.8px",
                // border: "1px solid blue",
              }}
              src="../../node.svg"
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

                // border: "1px solid blue",
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
                  // border: ".5px solid white",
                }}
              ></div>
              <div
                style={{
                  fontSize: "10px",
                  margin: "0px 0 0 0",
                  // color: "#2fc665",
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
              // border: "1px solid green",
              textAlign: "center",
              justifyContent: "left",
              alignItems: "flex-start",
              width: "100%",
              // alignContent: "flex-end",
              // border: "2px solid red",
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
                // border: "1px solid blue",
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
                    theme.palette.mode === "dark" ? "#7269ea" : "#928dd0",
                  padding: "3px 3px 3px 4px",
                  borderRadius: "3px",
                  width: `${props.nodesArr[i]["role"].length * 8.1}px`, //"105px",
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
                // border: "1px solid red",
                // color: `${readyStatusRunning}`,
              }}
            >
              <div
                style={
                  {
                    // border: "1px solid yellow"
                  }
                }
              >
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
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                  // border: "2px solid red",
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
                  // border: "1px solid red",

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
                // border: "1px solid red",
                // color: `${readyStatusRunning}`,
              }}
            >
              <div
                style={
                  {
                    // border: "1px solid yellow"
                  }
                }
              >
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
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                  // border: "2px solid red",
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
                  // border: "1px solid red",

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

  let nodesPodsList = [];
  let tempPodList = props.podsArr.filter(
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
      nodesPodsCpuPercentColorLight = "#ffffff80";
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
      nodesPodsMemoryColorLight = "#ffffff80";
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
          // border: "2px solid red",
        }}
      >
        POD {i + 1}
        <Button
          key={i}
          id="podButt"
          // onClick={() => handlePodOpen(podsArr[i])}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "380px",
            height: "125px",
            fontSize: "16px",
            // border: "1px solid white",
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
                : "10px 10px 1px #00000020",
            background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              // border: "1px solid yellow",
              width: "350px",
              margin: "20px 0 0 0",
            }}
          >
            <img
              style={{ width: "45px", marginLeft: "0px" }}
              src="../../pod.svg"
            ></img>
            <span
              style={{
                margin: "0px 0 0 15px",
                width: "250px",
                lineHeight: "19px",
                textTransform: "none",
                fontSize: "16px",
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
                  // border: ".5px solid white",
                }}
              ></div>
              <div
                style={{
                  color: `${nodesPodsStatuColor}`,
                  justifyContent: "right",
                  fontSize: "9px",
                  margin: "2px 0 0px 0",
                  lineHeight: "10px",
                  // border: ".5px solid white",
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
              // border: "1px solid green",
              textAlign: "center",
              justifyContent: "left",
              alignItems: "flex-start",
              width: "100%",
              // height:"100px",
              alignContent: "flex-end",
              // border: "2px solid red",
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
                // border: "1px solid blue",
                lineHeight: "13px",
                textTransform: "none",
                opacity: ".5",
                // color: `${readyStatusRunning}`,
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
                // border: "1px solid red",
                // color: `${readyStatusRunning}`,
              }}
            >
              <div
                style={
                  {
                    // border: "1px solid yellow"
                  }
                }
              >
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "10px",
                    marginLeft: "10.5px",
                    rotate: "-131deg",
                    color: "#ffffff40",

                    width: "60px",
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                  //Number(`${podsArr[i]["podCpuLimit"]}`)

                  // Number(
                  //   selectedNodeContainers[i]["cpuUsage"].slice(0, -1)
                  // )  / Number(`${podsArr[i]["podCpuLimit"]}`)
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
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                  // border: "2px solid red",
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
                  // border: "1px solid red",

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
                // border: "1px solid red",
                // color: `${readyStatusRunning}`,
              }}
            >
              <div
                style={
                  {
                    // border: "1px solid yellow"
                  }
                }
              >
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={100 * 0.73}
                  style={{
                    marginTop: "10px",
                    marginLeft: "9.5px",
                    rotate: "-131deg",
                    color: "#ffffff40",

                    width: "60px",
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                    // border: "1px solid red",
                    // filter: "drop-shadow(10px 10px 10px #000000)",
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
                  // border: "2px solid red",
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
                  // border: "1px solid red",

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
            margin: "0 0 0 68px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: "24px",
                fontWeight: "900",
                letterSpacing: "3px",
                // border: "1px solid white",
                textAlign: "left",
                // color: "#ffffff",
                paddingTop: "10px",
                color: theme.palette.mode === "dark" ? "" : "#6d6fb4",
                userSelect: "none",
              }}
            >
              NODES
            </div>
            <div style={{ margin: "23px 0 0 8px", fontSize: "12px" }}>
              {" "}
              ( {nodeList.length} total )
            </div>
          </div>
          <div
            style={{
              // fontFamily: "Outfit",
              display: "flex",
              flexDirection: "row",
              width: "265px",
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
              marginTop: "10px",
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
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            margin: "0 0 0 68px",
          }}
        >
          <div
            style={{
              height: "1px",
              width: "975px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#ffffff99" : "#6d6fb4",
              // border: "1px solid white",
              // marginRight: "50px",
              marginTop: "0px",
            }}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "-4px -10px 0px 0px",
          }}
        >
          <Button
            // onClick={handleSort}
            style={{
              display: "flex",

              // fontFamily: "Outfit",
              fontSize: "9px",
              fontWeight: "900",
              letterSpacing: ".5px",
              border: "1px solid",
              height: "16px",
              textAlign: "left",
              // color: sortedByDisplay === "" ? "#ffffff99" : "",
              marginTop: "12px",
              marginLeft: "70px",
              padding: "8px 4px 8px 6px",
              marginBottom: "12px",
            }}
          >
            SORT BY{" "}
            <SortIcon style={{ width: "12px", margin: "0 4px 0 3px" }} />{" "}
            {/* {sortedByDisplay} */}
          </Button>{" "}
          {/* SHOW KUBE SYSTEM DIV STARTS HERE */}
          {/* <div style={{ display: "flex" }}>
            {" "}
            <div
              style={{
                fontSize: "10px",
                margin: "10.5px 0 0 0",
                color: theme.palette.mode === "dark" ? "#ffffff99" : "grey",
              }}
            >
              show kube-system
            </div>
            <Checkbox
              //@ts-ignore
              size="small"
              value="start"
              // checked={kubeSystemCheck}
              // onChange={handleKubeSystemChange}
              style={{
                marginTop: "-7px",
                color: theme.palette.mode === "dark" ? "" : "#00000050",
              }}
            />
          </div> */}
          {/* SHOW KUBE SYSTEM DIV ENDS HERE */}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "-20px 0 0 50px",
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
                    // border: "1px solid white",
                  }}
                >
                  <div style={{ width: "140px", height: "400px" }}>
                    <img
                      style={{
                        width: "100px",
                        height: "100px",
                        margin: "15px 25px 0 15px",
                      }}
                      src="../../node.svg"
                    ></img>
                  </div>
                  {"  "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // border: "1px solid green",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "820px",
                        // border: "1px solid yellow",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "38px",
                          fontWeight: "800",
                          letterSpacing: ".1px",
                          lineHeight: "40px",
                          padding: "30px 0 10px 10px",
                          // border: "1px solid yellow",
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
                          // border: "1px solid green",
                          // width:"200px"
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
                            // border: "5px solid white",
                          }}
                        ></div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "500",
                            color: `${selectedNodeStatusColor}`,
                          }}
                        >
                          {/* {selectedNode[0]["ready"].toUpperCase()} */}
                        </div>
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
                        // border: "1px solid pink",
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
                          // border: "2px solid green",
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
                            margin: "-20px 0 4px 0",
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "#7269ea"
                                : "#928dd0",
                            padding: "2px 9px 1px 10px",
                            borderRadius: "3px",
                            width: `${selectedNode[0]["role"].length * 17.5}px`, //"105px",
                            letterSpacing: ".5px",
                          }}
                        >
                          {selectedNode[0]["role"].toUpperCase()}
                        </div>
                        <div style={{ paddingLeft: "5px" }}>
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
                          {" " + selectedNode[0]["kernal"]}
                          <br />
                          <b>CONTAINER RUNTIME:</b>
                          {" " + selectedNode[0]["containerRuntime"]}
                          <br />
                          <b>READINESS GATES:</b>
                          {" " + selectedNode[0]["readinessGates"]}
                        </div>
                      </div>

                      {/* <div style={{ flexDirection: "column", width: "220px" }}>
                        <div
                          style={{ paddingLeft: "0px", color: "#ffffff99" }}
                        >
                          <br />
                          CPU USED: {selectedNode[0]["podCpuUsed"].toUpperCase()}
                          m
                          <br />
                          CPU LIMIT:{" "}
                          {selectedNode[0]["podCpuLimit"].toUpperCase()}m
                          <br />
                          CPU PERCENTAGE: {selectedNode[0]["podCpuPercent"]}%
                          <br />
                          MEMORY USED:{" "}
                          {selectedNode[0]["podMemoryUsed"].toUpperCase()}
                          Mi
                          <br />
                          MEMORY LIMIT:
                          {selectedNode[0]["podMemoryLimit"].toUpperCase()}Mi
                          <br />
                          MEMORY PERCENTAGE:{selectedNode[0]["podMemoryPercent"]}
                          %
                        </div>{" "}
                      </div> */}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "35px",
                          marginLeft: "5px",
                          // border: "1px solid yellow",
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
                            // border: "1px solid red",
                            // filter: "drop-shadow(10px 10px 10px #000000)",
                          }}
                        />
                        <CircularProgress
                          variant="determinate"
                          // @ts-nocheck
                          thickness={1.35}
                          value={
                            // 2 *
                            Number(`${selectedNode[0]["nodeCpuPercentMath"]}`) *
                            0.73
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

                            // border: "1px solid red",
                            // filter: "drop-shadow(10px 10px 10px #000000)",
                          }}
                        />
                        <div
                          style={{
                            position: "relative",
                            top: "-95px",
                            left: "0px",
                            fontSize: "38px",
                            fontWeight: "800",
                            marginTop: "-60px",
                            marginLeft: "-37px",
                            // border: "2px solid blue",
                            color:
                              Number(selectedNode[0]["nodeCpuPercentMath"]) < 90
                                ? `#2fc665`
                                : Number(
                                    selectedNode[0]["nodeCpuPercentMath"]
                                  ) > 90
                                ? "#cf4848"
                                : "yellow", //`${PodMemoryPercentColor}`,
                          }}
                        >
                          {`${selectedNode[0]["nodeCpuPercent"]}`}
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            position: "relative",
                            top: "-99px",
                            left: "-21px",
                            // border: "1px solid red",

                            marginRight: "-2px",
                            fontWeight: "400",
                            marginTop: "-8px",
                            color:
                              Number(selectedNode[0]["nodeCpuPercentMath"]) < 90
                                ? `#2fc665`
                                : Number(
                                    selectedNode[0]["nodeCpuPercentMath"]
                                  ) > 90
                                ? "#cf4848"
                                : "yellow", //"#cf4848", //`${PodMemoryPercentColor}`,
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
                            // display: "flex",
                            // flexDirection: "column",
                            // margin: "-50px 0 0 -29px",
                            textAlign: "center",
                            color:
                              Number(selectedNode[0]["nodeCpuPercentMath"]) < 90
                                ? `#2fc665`
                                : Number(
                                    selectedNode[0]["nodeCpuPercentMath"]
                                  ) > 90
                                ? "#cf4848"
                                : "yellow", //"#cf4848", //`${PodMemoryPercentColor}`,
                          }}
                        >
                          {" "}
                          CPU USED:{" "}
                          <strong>
                            {selectedNode[0]["nodeCpuUsed"].toUpperCase()}m
                          </strong>
                          <br />
                          CPU LIMIT:{" "}
                          <strong>
                            {selectedNode[0]["nodeCpuLimit"] === "NONE"
                              ? "NONE"
                              : `${selectedNode[0][
                                  "nodeCpuLimit"
                                ].toUpperCase()}m`}
                          </strong>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          // border: "1px solid yellow",
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
                            // border: "1px solid red",
                            // filter: "drop-shadow(10px 10px 10px #000000)",
                          }}
                        />
                        <CircularProgress
                          variant="determinate"
                          // @ts-nocheck
                          thickness={1.35}
                          value={
                            // 2 *
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
                              Number(
                                selectedNode[0]["nodeMemoryPercent"].slice(
                                  0,
                                  -1
                                )
                              ) < 90
                                ? `#2fc665`
                                : Number(
                                    selectedNode[0]["nodeMemoryPercent"].slice(
                                      0,
                                      -1
                                    )
                                  ) > 90
                                ? "#cf4848"
                                : "yellow",
                            width: "180px",

                            // border: "1px solid red",
                            // filter: "drop-shadow(10px 10px 10px #000000)",
                          }}
                        />
                        <div
                          style={{
                            position: "relative",
                            top: "-95px",
                            left: "0px",
                            fontSize:
                              selectedNode[0]["podMemoryPercent"] === "N/A"
                                ? "36px"
                                : "38px",
                            fontWeight: "800",
                            marginTop: "-60px",
                            marginLeft: "-37px",
                            // border: "2px solid blue",
                            color:
                              Number(
                                selectedNode[0]["nodeMemoryPercent"].slice(
                                  0,
                                  -1
                                )
                              ) < 90
                                ? `#2fc665`
                                : Number(
                                    selectedNode[0]["nodeMemoryPercent"].slice(
                                      0,
                                      -1
                                    )
                                  ) > 90
                                ? "#cf4848"
                                : "yellow", //`${PodMemoryPercentColor}`,
                          }}
                        >
                          {selectedNode[0]["nodeMemoryPercent"]}
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            position: "relative",
                            top: "-99px",
                            left: "-20px",
                            // border: "1px solid red",

                            marginRight: "-2px",
                            fontWeight: "400",
                            marginTop: "-8px",
                            color:
                              Number(
                                selectedNode[0]["nodeMemoryPercent"].slice(
                                  0,
                                  -1
                                )
                              ) < 90
                                ? `#2fc665`
                                : Number(
                                    selectedNode[0]["nodeMemoryPercent"].slice(
                                      0,
                                      -1
                                    )
                                  ) > 90
                                ? "#cf4848"
                                : "yellow", //"#cf4848", //`${PodMemoryPercentColor}`,
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
                            // display: "flex",
                            // flexDirection: "column",
                            // margin: "-50px 0 0 -29px",
                            textAlign: "center",
                            color:
                              Number(
                                selectedNode[0]["nodeMemoryPercent"].slice(
                                  0,
                                  -1
                                )
                              ) < 90
                                ? `#2fc665`
                                : Number(
                                    selectedNode[0]["nodeMemoryPercent"].slice(
                                      0,
                                      -1
                                    )
                                  ) > 90
                                ? "#cf4848"
                                : "yellow", //"#cf4848", //`${PodMemoryPercentColor}`,
                          }}
                        >
                          {" "}
                          MEM. USED:{" "}
                          <strong>
                            {selectedNode[0]["nodeMemoryUsedDisplay"]}
                          </strong>
                          <br />
                          MEM. LIMIT:{" "}
                          <strong>{selectedNode[0]["nodeMemoryLimit"]}</strong>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: "0 0 0 0px",
                        // border: "1px solid red",
                      }}
                    >
                     

                      <Button
                        // onClick={handlePodLogOpen}
                        style={{
                          width: "250px",
                          border: "1px solid",
                          fontSize: "14px",
                        }}
                      >
                        VIEW LOGS
                      </Button>
                      {/* <Modal open={openPodLog} onClose={handlePodLogClose}>
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
                          {podLogs}
                        </Box>
                      </Modal>
                      <Button
                        onClick={handlePodYamlOpen}
                        style={{
                          width: "250px",
                          border: "1px solid",
                          fontSize: "14px",
                          margin: "0 10px 0 25px",
                        }}
                      >
                        VIEW POD YAML
                      </Button>
                      <Modal open={openPodYaml} onClose={handlePodYamlClose}>
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
                            POD YAML OUTPUT
                          </div>
                          {podYaml}
                        </Box>
                      </Modal>
                      <Button
                        onClick={handlePodDeleteOpen}
                        style={{
                          width: "250px",
                          border: "1px solid",
                          fontSize: "14px",
                          margin: "0 10px 0 15px",
                        }}
                      >
                        DELETE / RESTART POD
                      </Button>
                      <Modal
                        open={openPodDelete}
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
                            Please note: if this pod is scheduled to be running,
                            then a new version will replace it after
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
                            <Button
                              onClick={handlePodDelete}
                              style={{
                                fontSize: "16px",
                                margin: "0 10px 0 0",
                                padding: "5px 15px 5px 15px",
                                border:
                                  theme.palette.mode === "dark"
                                    ? "1px solid #8f85fb"
                                    : "1px solid",
                                color:
                                  theme.palette.mode === "dark"
                                    ? "white"
                                    : "darkpurple",
                              }}
                            >
                              DELETE POD
                            </Button>
                            <Button
                              onClick={handlePodDeleteClose}
                              style={{
                                opacity: "50%",
                                fontSize: "15px",
                                margin: "0 0 0 10px",
                                padding: "5px 10px 5px 10px",
                                border: "1px solid #ffffff89",
                              }}
                            >
                              CANCEL
                            </Button>
                          </div>
                        </Box>
                      </Modal> */}
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
                          // border: "1px solid white",
                          textAlign: "left",
                          // color: "#ffffff",
                          paddingTop: "10px",
                        }}
                      >
                        NODE'S PODS
                      </div>
                      <div
                        style={{
                          margin: "0px 0 2px 10px",
                          // color: `${selectedNodeStatusColor}`,
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
                          // border: "1px solid white",
                          // marginRight: "50px",
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

  // <>
  //     <div
  //       style={{
  //         display: "flex",
  //         fontFamily: "Outfit",
  //         fontWeight: "400",
  //         fontSize: "17px",
  //         height: "auto",
  //         justifyContent: "center",
  //         overflow: "hidden",
  //         alignItems: "center",
  //         width: "auto",
  //         padding: "0px 10px 4px 20px",
  //         letterSpacing: "1px",
  //         color: theme.palette.mode === "dark" ? "#8f85fb" : "#9075ea",
  //         textShadow:
  //           theme.palette.mode === "dark"
  //             ? "1px 1px 2px black"
  //             : "2px 2px 0px #00000000",
  //         // border: "1px solid red",
  //       }}
  //     >
  //       NODE 1
  //     </div>
  //     <Button
  //       id="nodeButt"
  //       style={{
  //         fontFamily: "Outfit",
  //         fontWeight: "200",
  //         fontSize: "14px",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         width: "300px",
  //         padding: "10px 10px 10px 20px",
  //         letterSpacing: "1px",
  //         color: theme.palette.mode === "dark" ? "white" : "grey",
  //         border:
  //           theme.palette.mode === "dark"
  //             ? "1.2px solid white"
  //             : "1.2px solid #9075ea",
  //         borderRadius: "5px",
  //         boxShadow:
  //           theme.palette.mode === "dark"
  //             ? "10px 9px 2px #00000060"
  //             : "10px 10px 1px #00000020",
  //         backgroundColor:
  //           theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
  //       }}
  //     >
  //       <div
  //         style={{
  //           width: "500px",
  //           // border: "1px solid white",
  //           textAlign: "left",
  //           alignItems: "center",
  //         }}
  //       >
  //         Name: {nodesArr[0]}
  //         <br /> Status: {statusArr[0]}
  //         <br /> Role: {roleArr[0]}
  //         <br /> Age: {ageArr[0]}
  //         <br /> Version: {versionArr[0]}
  //       </div>
  //     </Button>
  // </>
  //

  // console.log("selected pod 3 is ", selectedNode);

  // console.log(" NODES ARR AT END IS ", nodesArr);

  return (
    <>
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
          marginLeft: "-24px",
          marginTop: "0px",
          marginBottom: "20px",
          textAlign: "center",
          width: "100%",
          // border: "1px solid red",
        }}
      >
        <div>{nodeListDiv}</div>
      </div>
    </>
  );
}

export default KraneNodeList;

// json output of describe or get node -o wide =
//
//{
// "apiVersion": "v1",
// "kind": "Node",
// "metadata": {
//     "annotations": {
//         "kubeadm.alpha.kubernetes.io/cri-socket": "unix:///var/run/cri-dockerd.sock",
//         "node.alpha.kubernetes.io/ttl": "0",
//         "volumes.kubernetes.io/controller-managed-attach-detach": "true"
//     },
//     "creationTimestamp": "2023-05-01T18:47:55Z",
//     "labels": {
//         "beta.kubernetes.io/arch": "arm64",
//         "beta.kubernetes.io/os": "linux",
//         "kubernetes.io/arch": "arm64",
//         "kubernetes.io/hostname": "docker-desktop",
//         "kubernetes.io/os": "linux",
//         "node-role.kubernetes.io/control-plane": "",
//         "node.kubernetes.io/exclude-from-external-load-balancers": ""
//     },
//     "name": "docker-desktop",
//     "resourceVersion": "1171992",
//     "uid": "2a49ff81-3780-4a1c-a9ca-e85be82b254f"
// },
// "spec": {},
// "status": {
//     "addresses": [
//         {
//             "address": "192.168.65.4",
//             "type": "InternalIP"
//         },
//         {
//             "address": "docker-desktop",
//             "type": "Hostname"
//         }
//     ],
//     "allocatable": {
//         "cpu": "4",
//         "ephemeral-storage": "56403987978",
//         "hugepages-1Gi": "0",
//         "hugepages-2Mi": "0",
//         "hugepages-32Mi": "0",
//         "hugepages-64Ki": "0",
//         "memory": "7937592Ki",
//         "pods": "110"
//     },
//     "capacity": {
//         "cpu": "4",
//         "ephemeral-storage": "61202244Ki",
//         "hugepages-1Gi": "0",
//         "hugepages-2Mi": "0",
//         "hugepages-32Mi": "0",
//         "hugepages-64Ki": "0",
//         "memory": "8039992Ki",
//         "pods": "110"
//     },
//     "conditions": [
//         {
//             "lastHeartbeatTime": "2023-09-20T22:01:10Z",
//             "lastTransitionTime": "2023-05-01T18:47:53Z",
//             "message": "kubelet has sufficient memory available",
//             "reason": "KubeletHasSufficientMemory",
//             "status": "False",
//             "type": "MemoryPressure"
//         },
//         {
//             "lastHeartbeatTime": "2023-09-20T22:01:10Z",
//             "lastTransitionTime": "2023-05-01T18:47:53Z",
//             "message": "kubelet has no disk pressure",
//             "reason": "KubeletHasNoDiskPressure",
//             "status": "False",
//             "type": "DiskPressure"
//         },
//         {
//             "lastHeartbeatTime": "2023-09-20T22:01:10Z",
//             "lastTransitionTime": "2023-05-01T18:47:53Z",
//             "message": "kubelet has sufficient PID available",
//             "reason": "KubeletHasSufficientPID",
//             "status": "False",
//             "type": "PIDPressure"
//         },
//         {
//             "lastHeartbeatTime": "2023-09-20T22:01:10Z",
//             "lastTransitionTime": "2023-05-01T18:48:26Z",
//             "message": "kubelet is posting ready status",
//             "reason": "KubeletReady",
//             "status": "True",
//             "type": "Ready"
//         }
//     ],
//     "daemonEndpoints": {
//         "kubeletEndpoint": {
//             "Port": 10250
//         }
//     },
//     "images": [
//         {
//             "names": [
//                 "hubproxy.docker.internal:5555/docker/desktop-kubernetes@sha256:f1573ffb14599a41a50fc9bd6f15c0f4060ed6ade929e9f2c458e5e3cc36cf68",
//                 "hubproxy.docker.internal:5555/docker/desktop-kubernetes:kubernetes-v1.25.9-cni-v1.1.1-critools-v1.25.0-cri-dockerd-v0.2.6-1-debian"
//             ],
//             "sizeBytes": 385396541
//         },
//         {
//             "names": [
//                 "grafana/grafana@sha256:00a4d2889c2b32f86c50673b1a82cb5b45349f1c24b0a882d11a53518e2ecae4",
//                 "grafana/grafana:9.5.1"
//             ],
//             "sizeBytes": 297448929
//         },
//         {
//             "names": [
//                 "quay.io/prometheus/prometheus@sha256:d2ab0a27783fd4ad96a8853e2847b99a0be0043687b8a5d1ebfb2dd3fa4fd1b8",
//                 "quay.io/prometheus/prometheus:v2.42.0"
//             ],
//             "sizeBytes": 225839649
//         },
//         {
//             "names": [
//                 "registry.k8s.io/etcd:3.5.6-0"
//             ],
//             "sizeBytes": 180688846
//         },
//         {
//             "names": [
//                 "registry.k8s.io/etcd:3.5.5-0"
//             ],
//             "sizeBytes": 178899047
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-apiserver:v1.25.9"
//             ],
//             "sizeBytes": 123299566
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-apiserver:v1.25.4"
//             ],
//             "sizeBytes": 123202762
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-controller-manager:v1.25.9"
//             ],
//             "sizeBytes": 112814099
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-controller-manager:v1.25.4"
//             ],
//             "sizeBytes": 112651759
//         },
//         {
//             "names": [
//                 "quay.io/kiwigrid/k8s-sidecar@sha256:eaa478cdd0b8e1be7a4813bc1b01948b838e2feaa6d999e60c997dc823013824",
//                 "quay.io/kiwigrid/k8s-sidecar:1.22.0"
//             ],
//             "sizeBytes": 77954382
//         },
//         {
//             "names": [
//                 "registry.k8s.io/metrics-server/metrics-server@sha256:ee4304963fb035239bb5c5e8c10f2f38ee80efc16ecbdb9feb7213c17ae2e86e",
//                 "registry.k8s.io/metrics-server/metrics-server:v0.6.4"
//             ],
//             "sizeBytes": 66906490
//         },
//         {
//             "names": [
//                 "quay.io/prometheus/alertmanager@sha256:fd4d9a3dd1fd0125108417be21be917f19cc76262347086509a0d43f29b80e98",
//                 "quay.io/prometheus/alertmanager:v0.25.0"
//             ],
//             "sizeBytes": 63233000
//         },
//         {
//             "names": [
//                 "k8s.gcr.io/metrics-server/metrics-server@sha256:6c5603956c0aed6b4087a8716afce8eb22f664b13162346ee852b4fab305ca15",
//                 "k8s.gcr.io/metrics-server/metrics-server:v0.5.0"
//             ],
//             "sizeBytes": 60016245
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-proxy:v1.25.9"
//             ],
//             "sizeBytes": 58056002
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-proxy:v1.25.4"
//             ],
//             "sizeBytes": 57990466
//         },
//         {
//             "names": [
//                 "k8s.gcr.io/metrics-server/metrics-server@sha256:78035f05bcf7e0f9b401bae1ac62b5a505f95f9c2122b80cff73dcc04d58497e",
//                 "k8s.gcr.io/metrics-server/metrics-server:v0.4.1"
//             ],
//             "sizeBytes": 57796983
//         },
//         {
//             "names": [
//                 "quay.io/prometheus-operator/prometheus-operator@sha256:be4fbe0cfcad639e7a9ce40274917e1e30a3cae045ae27cde35ac84739fdef40",
//                 "quay.io/prometheus-operator/prometheus-operator:v0.63.0"
//             ],
//             "sizeBytes": 53228029
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-scheduler:v1.25.9"
//             ],
//             "sizeBytes": 49441087
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-scheduler:v1.25.4"
//             ],
//             "sizeBytes": 49278447
//         },
//         {
//             "names": [
//                 "registry.k8s.io/coredns/coredns:v1.9.3"
//             ],
//             "sizeBytes": 47660771
//         },
//         {
//             "names": [
//                 "registry.k8s.io/kube-state-metrics/kube-state-metrics@sha256:ec5732e28f151de3847df60f48c5a570aacdb692ff1ce949d97105ae5e5a6722",
//                 "registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.8.2"
//             ],
//             "sizeBytes": 40442314
//         },
//         {
//             "names": [
//                 "docker/desktop-storage-provisioner:v2.0"
//             ],
//             "sizeBytes": 39816902
//         },
//         {
//             "names": [
//                 "docker/desktop-vpnkit-controller:dc331cb22850be0cdd97c84a9cfecaf44a1afb6e"
//             ],
//             "sizeBytes": 34992760
//         },
//         {
//             "names": [
//                 "quay.io/prometheus/node-exporter@sha256:39c642b2b337e38c18e80266fb14383754178202f40103646337722a594d984c",
//                 "quay.io/prometheus/node-exporter:v1.5.0"
//             ],
//             "sizeBytes": 21845668
//         },
//         {
//             "names": [
//                 "docker/desktop-vpnkit-controller:v2.0"
//             ],
//             "sizeBytes": 19178584
//         },
//         {
//             "names": [
//                 "quay.io/prometheus-operator/prometheus-config-reloader@sha256:3f976422884ec7744f69084da7736927eb634914a0c035d5a865cf6a6b8eb1b0",
//                 "quay.io/prometheus-operator/prometheus-config-reloader:v0.63.0"
//             ],
//             "sizeBytes": 12333565
//         },
//         {
//             "names": [
//                 "registry.k8s.io/pause:3.8"
//             ],
//             "sizeBytes": 514000
//         }
//     ],
//     "nodeInfo": {
//         "architecture": "arm64",
//         "bootID": "09ba70b6-5aaf-484f-9189-5c5c85ec7200",
//         "containerRuntimeVersion": "docker://24.0.2",
//         "kernelVersion": "5.15.49-linuxkit-pr",
//         "kubeProxyVersion": "v1.25.4",
//         "kubeletVersion": "v1.25.4",
//         "machineID": "08187e84-990c-459e-a1c3-18edd2c5ee23",
//         "operatingSystem": "linux",
//         "osImage": "Docker Desktop",
//         "systemUUID": "08187e84-990c-459e-a1c3-18edd2c5ee23"
//     }
// }
//
