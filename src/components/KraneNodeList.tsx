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

function KraneNodeList() {
  const [nodesArr, setNodesArr] = useState([]);

  const theme = useTheme();

  let kraneCommand: string = "kubectl get nodes -o wide";
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
        nodeCpuMath: "",
        nodeMemoryUsed: "",
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
    setNodesArr([...filteredNodes]);
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
      if (argArr[i] === "G") {
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
        nodeMemoryUsedArr.push("0");
      } else if (argArr[i] === "M") {
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
    }
    // console.log(" FILTERD Nodes AFTER USAGE FETCH IS ", filteredNodes);

    setNodesArr([...filteredNodes]);
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

    setNodesArr([...filteredNodes]);
  });

  useEffect(() => {
    // ----------------------------------------- get NODES section ------------

    //send krane command to get all nodes
    ipcRenderer.send("getNodes_command", {
      kraneCommand,
      currDir,
    });

    //---------------------------------------- get all nodes cpu and memory usage -
    let nodesCpuUsedCommand = `kubectl top nodes`;
    setTimeout(() => {
      ipcRenderer.send("getNodesCpuUsed_command", {
        nodesCpuUsedCommand,
        currDir,
      });
    }, 1300);

    let nodesCpuLimitsCommand = `kubectl get nodes -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu,Memory-limit:spec.containers[*].resources.limits.cpu"`;
    setTimeout(() => {
      ipcRenderer.send("getNodesCpuLimits_command", {
        nodesCpuLimitsCommand,
        currDir,
      });
    }, 1500);
  }, []);

  //-----------------------------------------------------------START OF FOR LOOP TO PUSH NODE LIST JSX

  let nodeList = [];
  for (let i = 0; i < nodesArr.length; i++) {
    let nodeReadyStatusRunning;
    let nodeCpuPercentColor;
    let nodeCpuPercentColorLight;
    let nodeMemoryPercentColor;
    let nodeMemoryPercentColorLight;

    if (nodesArr[i]["status"] === "Ready") {
      nodeReadyStatusRunning = "#2fc665";
    } else {
      nodeReadyStatusRunning = "rgba(210, 223, 61)";
    }

    // if (nodesArr[i]["nodeCpuLimit"] === "NONE") {
    //   nodeCpuPercentColor = "#ffffff80";
    //   nodeCpuPercentColorLight = "#00000040";
    // } else
    if (nodesArr[i]["nodeCpuPercentMath"] < 90) {
      nodeCpuPercentColor = "#2fc665";
      nodeCpuPercentColorLight = "#5bb57b";
    } else {
      nodeCpuPercentColor = "#cf4848";
      nodeCpuPercentColorLight = "#d35656";
    }

    console.log("color is", nodeCpuPercentColorLight);

    // if (nodesArr[i]["nodeMemoryPercent"] === "N/A") {
    //   nodeMemoryPercentColor = "#ffffff80";
    //   nodeMemoryPercentColorLight = "#00000040";
    // } else
    let temp = Number(nodesArr[i]["nodeMemoryPercent"].slice(0, -1));
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
        }}
      >
        NODE {i + 1}
        <Button
          key={i}
          id="podButt"
          // onClick={() => handleCommandOpen(nodesArr[i])}
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
              {nodesArr[i]["name"]}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                alignItems: "flex-end",
                justifyContent: "right",
                margin: "2px 10px 0 0",

                // border: "1px solid blue",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "15px",
                  backgroundColor: "#2fc665",
                  justifyContent: "right",
                  margin: "5px 0 2px 0",
                  // border: ".5px solid white",
                }}
              ></div>
              <div
                style={{
                  fontSize: "10px",
                  margin: "-4px 0 0 0",
                  // color: "#2fc665",
                  color: `${nodeReadyStatusRunning}`,
                }}
              >
                {nodesArr[i]["status"]}
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
                  display:"flex",
                  fontSize: "13px",
                  color: theme.palette.mode === "dark" ? "#ffffff" : "white",
                  fontWeight: "500",
                  margin: "-4px 0 4px 0",
                  backgroundColor: theme.palette.mode === "dark" ? "#7269ea" : "#8d85f3",
                  padding:"3px 3px 3px 4px",
                  borderRadius:"3px",
                  width:"57%"
                }}
              >
                {nodesArr[i]["role"].toUpperCase()}
              </div>
              <div style={{ margin: "-11px 0 0 0" }}>
                {" "}
                <br />
                CPU USAGE:{" "}
                {nodesArr[i]["nodeCpuLimit"] === "NONE" ||
                nodesArr[i]["nodeCpuLimit"] === ""
                  ? `${nodesArr[i]["nodeCpuUsed"]}m`
                  : `${nodesArr[i]["nodeCpuUsed"]}m / ${nodesArr[i]["nodeCpuLimit"]}m`}
                <br />
                CPU PERCENT: {nodesArr[i]["nodeCpuPercent"]}
                <br />
                MEMORY USAGE:{" "}
                {nodesArr[i]["nodeMemoryLimit"] === "NONE" ||
                nodesArr[i]["nodeMemoryLimit"] === ""
                  ? `${nodesArr[i]["nodeMemoryUsed"]}`
                  : `${nodesArr[i]["nodeMemoryUsed"]} / ${nodesArr[i]["nodeMemoryLimit"]}`}
                <br />
                MEMORY PERCENT: {nodesArr[i]["nodeMemoryPercent"]}
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
                  value={Number(nodesArr[i]["nodeCpuPercentMath"]) * 0.73}
                  style={{
                    position: "relative",
                    top: "-48px",
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
                  fontSize: "16px",
                  fontWeight: "500",
                  marginTop: "-60px",
                  marginLeft: "-8px",
                  // border: "2px solid red",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodeCpuPercentColor}`
                      : `${nodeCpuPercentColorLight}`,
                }}
              >
                {nodesArr[i]["nodeCpuPercent"]}
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
                    Number(`${nodesArr[i]["nodeMemoryPercent"].slice(0, -1)}`) *
                    0.73
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
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
                  fontSize: "16px",
                  marginTop: "-60px",
                  // border: "2px solid red",
                  color:
                    theme.palette.mode === "dark"
                      ? `${nodeMemoryPercentColor}`
                      : `${nodeMemoryPercentColorLight}`,
                }}
              >
                {`${nodesArr[i]["nodeMemoryPercent"]}`}
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

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let nodeListDiv;
  if (nodesArr[0]) {
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
              }}
            >
              NODES
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
              // onClick={handleClick}
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
          <div style={{ display: "flex" }}>
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
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "-20px 0 0 50px",
          }}
        >
          {nodeList}
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

  // console.log("selected pod 3 is ", selectedPod);

  console.log(" NODES ARR AT END IS ", nodesArr);

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
