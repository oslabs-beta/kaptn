import React, { useState, useEffect, useReducer } from "react";
import Button from "@mui/material/Button";
import { Typography, useTheme, Box, Modal, Checkbox } from "@mui/material";
const { ipcRenderer } = require("electron");
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { JsxElement } from "typescript";
import SortIcon from "@mui/icons-material/Sort";
import PodCpuChart from "./PodCpuChart";
import PodMemoryChart from "./PodMemoryChart";

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

let sortIncrement = 0;

function KranePodList(props) {
  const theme = useTheme();

  let currDir = "NONE SELECTED";

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
    mt: 2,
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

  const [kubeSystemCheck, setKubeSystemCheck] = React.useState(false);
  const [kubeSystemPods, setKubeSystemPods] = React.useState([]);

  const [podsStatsObj, setPodsStatsObj] = useState({});

  // ----------------------------------------- get pods info section ------------

  function handleClick(event) {
    props.getPodsAndContainers();
  } // ---------------------- end of handle click function to refresh pods

  let podsArrOutput: any = [];

  //Listen to "get pods" return event and set pods array
  ipcRenderer.on("got_pods", (event, arg) => {
    let argArr = arg.split("");

    let i: number = 0;

    //skip row of column titles
    while (arg[i] !== "\n") {
      i++;
    }
    i++;

    //for loop to put all pods in array of objects
    for (let j = 0; i < argArr.length; i++) {
      let namespaceOutput: any = [];
      let nameOutput: any = [];
      let readyOutput: any = [];
      let statusOutput: any = [];
      let restartsOutput: any = [];
      let lastRestartOutput: any = [];
      let ageOutput: any = [];
      let ipOutput: any = [];
      let nodeOutput: any = [];
      let nominatedOutput: any = [];
      let readinessOutput: any = [];

      //saves namespaces
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
      //saves ready status
      while (arg[i] !== " ") {
        readyOutput.push(arg[i]);
        i++;
      }

      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves status
      while (arg[i] !== " ") {
        statusOutput.push(arg[i]);
        i++;
      }

      //check if status is "CONTAINERCREATING" and shorten for display
      if (statusOutput.length === 17) {
        statusOutput = ["C", "R", "E", "A", "T", "I", "N", "G"];
      }

      //check if status is "PODINITIALIZING" and shorten for display
      if (statusOutput.length === 15) {
        statusOutput = ["C", "R", "E", "A", "T", "I", "N", "G"];
      }

      //skip spaces
      while (arg[i] === " ") {
        i++;
      }

      // handle if no restarts then no last restart
      if (arg[i] === "0") {
        restartsOutput = ["0"];
        lastRestartOutput = ["N", "/", "A"];
        i++;
      } else {
        //save first part of "restarts"
        while (arg[i] !== " ") {
          restartsOutput.push(arg[i]);
          i++;
        }

        //skip spaces in middle of restarts
        i += 2;

        // save last restart
        while (arg[i] !== ")") {
          lastRestartOutput.push(arg[i]);
          i++;
        }
        i++;
      }

      //skip spaces
      while (arg[i] === " ") {
        i++;
      }

      //handle if age is 0
      if (arg[i] === "0") {
        ageOutput = [...ageOutput, "0"];
      } else {
        //save age
        while (
          arg[i] === "d" ||
          arg[i] === "h" ||
          arg[i] === "m" ||
          arg[i] === "s" ||
          arg[i] === "0" ||
          arg[i] === "1" ||
          arg[i] === "2" ||
          arg[i] === "3" ||
          arg[i] === "4" ||
          arg[i] === "5" ||
          arg[i] === "6" ||
          arg[i] === "7" ||
          arg[i] === "8" ||
          (arg[i] === "9" && i < arg.length)
        ) {
          ageOutput.push(arg[i]);
          i++;
        }
      }
      //skip spaces after age before IP address
      while (arg[i] === " ") {
        i++;
      }

      //save ip address
      while (arg[i] !== " ") {
        ipOutput.push(arg[i]);
        i++;
      }

      //skip spaces after IP address before node
      while (arg[i] === " ") {
        i++;
      }

      //save node
      while (arg[i] !== " ") {
        nodeOutput.push(arg[i]);
        i++;
      }

      //skip spaces after node before nominated node
      while (arg[i] === " ") {
        i++;
      }

      //save nominated node
      while (arg[i] !== " ") {
        nominatedOutput.push(arg[i]);
        i++;
      }

      //skip spaces after nominated node before readiness gates
      while (arg[i] === " ") {
        i++;
      }
      //save readiness gates
      while (
        arg[i] === "n" ||
        arg[i] === "o" ||
        arg[i] === "e" ||
        arg[i] === "<" ||
        arg[i] === ">" ||
        arg[i] === "0" ||
        arg[i] === "1" ||
        arg[i] === "2" ||
        arg[i] === "3" ||
        arg[i] === "4" ||
        arg[i] === "5" ||
        arg[i] === "6" ||
        arg[i] === "7" ||
        arg[i] === "8" ||
        arg[i] === "9"
      ) {
        readinessOutput.push(arg[i]);
        i++;
      }

      let pod: any = {
        index: j,
        namespace: namespaceOutput.join(""),
        name: nameOutput.join(""),
        ready: readyOutput.join(""),
        status: statusOutput.join(""),
        restarts: restartsOutput.join(""),
        lastRestart: lastRestartOutput.join(""),
        age: ageOutput.join(""),
        podCpuUsed: "",
        podMemoryUsed: "",
        podMemoryUsedDisplay: "",
        podCpuLimit: "",
        podMemoryLimit: "",
        podMemoryLimitDisplay: "",
        ipAddress: ipOutput.join(""),
        node: nodeOutput.join(""),
        nominatedNode: nominatedOutput.join(""),
        readinessGates: readinessOutput.join(""),
        podContainers: [],
      };

      //increment j for index value
      j++;

      podsArrOutput.push(pod);
    } // ---------  end of for loop

    filteredPods = podsArrOutput.filter(
      (ele: any, ind: number) =>
        ind === podsArrOutput.findIndex((elem) => elem.name === ele.name)
    );

    props.setPodsArr([...filteredPods]);
    props.setAllPodsArr([...filteredPods]);
  }); // --------------------------end of ipc render to get all pods o wide info  -

  // ----------------------------------- Listen to "get cpuUsed" return event
  ipcRenderer.on("got_cpuUsed", (event, arg) => {
    let date = new Date().toISOString();
    // let tempPodsStatsObj = JSON.parse(JSON.stringify(podsStatsObj));
    let tempPodsStatsObj = podsStatsObj;

    let argArr = arg.split("");
    // console.log("arg split is", arg.split(""));
    let podUsageArray = [];

    let pod = {};

    let i: number = 0;

    //skips row of column titles
    while (argArr[i] !== "\n") {
      i++;
    }
    i++;

    // //for loop to put all pods in array of objects
    for (let j = 0; i < argArr.length; i++) {
      let podCpuUsedArr = [];
      let podMemoryUsedArr = [];
      let podMemoryUsedDisplayArr = [];
      let podName = [];

      //skips namespace because array order is same for both outputs
      while (argArr[i] !== " ") {
        i++;
      }

      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }

      //skips name because array order is same for both outputs
      while (argArr[i] !== " ") {
        podName.push(argArr[i]);
        i++;
      }

      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }

      //   // //save cpu(cores) to array to parse at end of loops
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
        podCpuUsedArr.push(argArr[i]);
        i++;
      }
      i++;

      //skip spaces after number of cores
      while (arg[i] !== " ") {
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
        podMemoryUsedArr.push(arg[i]);
        i++;
      }
      if (argArr[i] === "G") {
        podMemoryUsedDisplayArr = [...podMemoryUsedArr, "G", "i"];
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
      } else if (argArr[i] === "M") {
        podMemoryUsedDisplayArr = [...podMemoryUsedArr, "M", "i"];
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
      }
      i += 2;

      //skip spaces
      while (arg[i] === " ") {
        i++;
      }
      i++;

      //join used values and add them to object
      pod = {
        podName: podName.join(""),
        podCpuUsed: podCpuUsedArr.join(""),
        podMemoryUsed: podMemoryUsedArr.join(""),
        podMemoryUsedDisplay: podMemoryUsedDisplayArr.join(""),
      };

      j++;

      // console.log("podstats obj is:", tempPodsStatsObj);
      // PodsLiveStatsArray.push(podsCurrentStats);
      podUsageArray.push(pod);
    } //end of for loop

    // let finalPodUsageArr = podUsageArray.filter(
    //   (ele: any, ind: number) =>
    //     ind ===
    //     podUsageArray.findIndex(
    //       (elem) =>
    //         elem.podCpuUsed === ele.podCpuUsed &&
    //         elem.podMemoryUsed === ele.podMemoryUsed
    //     )
    // );

    // props.setPodsArr([...filteredPods]);
    // props.setAllPodsArr([...filteredPods]);

    for (let j = 0; j < podUsageArray.length; j++) {
      filteredPods[j]["podCpuUsed"] = podUsageArray[j]["podCpuUsed"];
      filteredPods[j]["podMemoryUsed"] = podUsageArray[j]["podMemoryUsed"];
      filteredPods[j]["podMemoryUsedDisplay"] =
        podUsageArray[j]["podMemoryUsedDisplay"];
    }
    // console.log(filteredPods);
    props.setPodsArr([...filteredPods]);
    props.setAllPodsArr([...filteredPods]);

    for (let j = 0; j < podUsageArray.length; j++) {
      if (tempPodsStatsObj[podUsageArray[j]["podName"]] === undefined) {
        let podsCurrentStats = {
          date: date,
          cpu: Number(podUsageArray[j]["podCpuUsed"]),
          memory: Number(podUsageArray[j]["podMemoryUsed"]),
          memoryDisplay: podUsageArray[j]["podMemoryUsedDisplay"],
        };

        tempPodsStatsObj[podUsageArray[j]["podName"]] = [podsCurrentStats];
      } else {
        let podsCurrentStats = {
          date: date,
          cpu: Number(podUsageArray[j]["podCpuUsed"]),
          memory: Number(podUsageArray[j]["podMemoryUsed"]),
          memoryDisplay: podUsageArray[j]["podMemoryUsedDisplay"],
        };

        tempPodsStatsObj[podUsageArray[j]["podName"]].push(podsCurrentStats);
      }
    }

    // let podsCurrentStats = {
    //   date: date,
    //   podName: podName.join(""),
    //   cpu: Number(podCpuUsedArr.join("")),
    //   memory: Number(podMemoryUsedArr.join("")),
    //   memoryDisplay: podMemoryUsedDisplayArr.join(""),
    // };

    // if (tempPodsStatsObj[`${podName.join("")}`] === undefined) {
    //   tempPodsStatsObj[`${podName.join("")}`] = [podsCurrentStats];
    // } else {
    //   tempPodsStatsObj[`${podName.join("")}`] = [...tempPodsStatsObj[`${podName.join("")}`], podsCurrentStats];
    // }

    setPodsStatsObj(tempPodsStatsObj);
  }); // -------------------- end of ipc render function for get pods cpu used

  //Listen to "get cpuUsed" return event
  ipcRenderer.on("got_cpuLimits", (event, arg) => {
    let argArr = arg.split("");
    let podLimitsArray = [];

    let pod = {};

    let i: number = 0;

    //skips row of column titles
    while (argArr[i] !== "\n") {
      i++;
    }
    i++;

    // //for loop to put all pods in array of objects
    for (let j = 0; i < argArr.length; i++) {
      let podCpuLimitsArr = [];
      let podMemoryLimitsArr = [];
      let podMemoryLimitsDisplayArr = [];
      let podNameArr = [];

      //take name because maybe be duplicate values
      while (argArr[i] !== " ") {
        podNameArr.push(argArr[i]);
        i++;
      }
      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }

      if (argArr[i] === "<") {
        podCpuLimitsArr = ["N", "O", "N", "E"];
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
          podCpuLimitsArr.push(argArr[i]);
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
        podMemoryLimitsArr = ["N", "O", "N", "E"];
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
          podMemoryLimitsArr.push(arg[i]);
          i++;
        }
        if (argArr[i] === "G") {
          podMemoryLimitsDisplayArr = [...podMemoryLimitsArr, "G", "i"];
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
        } else if (argArr[i] === "M") {
          podMemoryLimitsDisplayArr = [...podMemoryLimitsArr, "M", "i"];
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
        }

        i += 3;
      }

      //   //join used values and add them to object
      pod = {
        podName: podNameArr.join(""),
        podCpuLimit: podCpuLimitsArr.join(""),
        podMemoryLimit: podMemoryLimitsArr.join(""),
        podMemoryLimitDisplay: podMemoryLimitsDisplayArr.join(""),
      };

      j++;

      podLimitsArray.push(pod);
      pod = {};
    } //end of for loop

    let lastPodsArr = podLimitsArray.filter(
      (ele: any, ind: number) =>
        ind === podLimitsArray.findIndex((elem) => elem.podName === ele.podName)
    );

    props.setPodsArr([...filteredPods]);
    props.setAllPodsArr([...filteredPods]);

    for (let j = 0; j < lastPodsArr.length; j++) {
      let currentCpu = lastPodsArr[j]["podCpuLimit"];
      let currentMemory = lastPodsArr[j]["podMemoryLimit"];
      let currentMemoryDisplay = lastPodsArr[j]["podMemoryLimitDisplay"];
      filteredPods[j]["podCpuLimit"] = currentCpu;
      filteredPods[j]["podMemoryLimit"] = currentMemory;
      filteredPods[j]["podMemoryLimitDisplay"] = currentMemoryDisplay;

      if (currentCpu === "NONE") {
        filteredPods[j]["podCpuPercent"] = "N/A";
      } else {
        let cpuUsed = Number(filteredPods[j]["podCpuUsed"]);
        filteredPods[j]["podCpuPercent"] = cpuUsed / currentCpu;
        if (filteredPods[j]["podCpuPercent"] >= 1) {
          filteredPods[j]["podCpuPercent"] = 100;
        } else {
          filteredPods[j]["podCpuPercent"] =
            filteredPods[j]["podCpuPercent"] * 100;
          if (filteredPods[j]["podCpuPercent"] % 1 !== 0) {
            let temp = filteredPods[j]["podCpuPercent"].toFixed(1);
            filteredPods[j]["podCpuPercent"] = Number(temp);
          }
        }
      }

      if (currentMemory === "NONE") {
        filteredPods[j]["podMemoryPercent"] = "N/A";
      } else {
        let memoryUsed = Number(filteredPods[j]["podMemoryUsed"]);
        filteredPods[j]["podMemoryPercent"] = memoryUsed / currentMemory;
        if (filteredPods[j]["podMemoryPercent"] >= 1) {
          filteredPods[j]["podMemoryPercent"] = 100;
        } else {
          filteredPods[j]["podMemoryPercent"] =
            filteredPods[j]["podMemoryPercent"] * 100;
          if (filteredPods[j]["podMemoryPercent"] % 1 !== 0) {
            let temp = filteredPods[j]["podMemoryPercent"].toFixed(1);
            filteredPods[j]["podMemoryPercent"] = Number(temp);
          }
        }
      }

      if (props.selectedNamespace !== "ALL") {
        let kubePods = filteredPods.filter(
          (pod) => pod.namespace !== props.selectedNamespace
        );
        setKubeSystemPods([...kubePods]);

        let kubeFilteredPods = filteredPods.filter(
          (pod) => pod.namespace === props.selectedNamespace
        );
        props.setPodsArr([...kubeFilteredPods]);
      } else if (props.selectedNamespace !== "ALL") {
        props.setPodsArr([...filteredPods]);
        props.setAllPodsArr([...filteredPods]);
      }
    } //end of for loop
  }); //-------------------   end of ipc render function to get podcpu and memory limits

  //handle returned pod container info
  ipcRenderer.on("podContainersRetrieved", (event, arg) => {
    let argArr = arg.split("");
    let output = [];

    let i = 0;
    //skips all column titles
    while (argArr[i] !== "\n") {
      i++;
    }
    i++;

    for (let j = 0; i < argArr.length; i++) {
      let podName = "";
      let name = "";
      let cpuUsage = "";
      let memoryUsage = "";

      //skips namespaces
      while (argArr[i] !== " ") {
        i++;
      }

      //skips spaces
      while (argArr[i] === " ") {
        i++;
      }

      //saves pod name
      while (argArr[i] !== " ") {
        podName += argArr[i];
        i++;
      }

      //skips spaces
      while (argArr[i] === " ") {
        i++;
      }

      //saves container name
      while (argArr[i] !== " ") {
        name += argArr[i];
        i++;
      }

      //skips spaces
      while (argArr[i] === " ") {
        i++;
      }

      //saves cpu usage
      while (argArr[i] !== " ") {
        cpuUsage += argArr[i];
        i++;
      }

      //skips spaces
      while (argArr[i] === " ") {
        i++;
      }

      //saves memory usage
      while (argArr[i] !== " ") {
        memoryUsage += argArr[i];
        i++;
      }

      //skips spaces
      while (argArr[i] !== "\n") {
        i++;
      }

      let memoryUsageMath = "";
      if (memoryUsage.slice(-2, -1) === "G") {
        let temp = memoryUsage.slice(0, -2);
        temp += "000000";
        memoryUsageMath = temp;
      } else if (memoryUsage.slice(-2, -1) === "M") {
        let temp = memoryUsage.slice(0, -2);
        temp += "000";
        memoryUsageMath = temp;
      }

      let container = {
        podName: podName,
        name: name,
        cpuUsage: cpuUsage,
        cpuUsageMath: Number(cpuUsage.slice(0, -1)),
        memoryUsage: memoryUsage,
        memoryUsageMath: Number(memoryUsageMath),
      };

      output.push(container);
    } //end of for loop over containers

    props.setPodsContainersArr([...output]);

    let toSortPods = [...props.podsArr];
    // console.log(toSortPods);
    if (sortedByDisplayArray[sortIncrement % 6] === "") {
      toSortPods.sort((a, b) => a.index - b.index);
    } else if (sortedByDisplayArray[sortIncrement % 6] === "max cpu") {
      //reset to sorted by index
      toSortPods.sort((a, b) => a.index - b.index);

      let numberArr = [];
      let stringArr = [];
      for (let k = 0; k < props.podsArr.length; k++) {
        if (typeof props.podsArr[k]["podCpuPercent"] === "number") {
          numberArr.push(props.podsArr[k]);
        } else stringArr.push(props.podsArr[k]);
      }
      numberArr.sort((a, b) => a["podCpuPercent"] - b["podCpuPercent"]);
      toSortPods = [...stringArr, ...numberArr];
      toSortPods.reverse();
    } else if (sortedByDisplayArray[sortIncrement % 6] === "max memory") {
      //reset to sorted by index
      toSortPods.sort((a, b) => a.index - b.index);
      let numberArr = [];
      let stringArr = [];
      for (let k = 0; k < props.podsArr.length; k++) {
        if (typeof props.podsArr[k]["podMemoryPercent"] === "number") {
          numberArr.push(props.podsArr[k]);
        } else stringArr.push(props.podsArr[k]);
      }
      numberArr.sort((a, b) => a["podMemoryPercent"] - b["podMemoryPercent"]);
      toSortPods = [...stringArr, ...numberArr];
      toSortPods.reverse();
    } else {
      //reset to sorted by index
      toSortPods.sort((a, b) => a.index - b.index);
      //sort by whatever other propery name alphabeticcaly
      toSortPods.sort((a, b) =>
        a[sortedByArray[sortIncrement % 6]].localeCompare(
          b[sortedByArray[sortIncrement % 6]]
        )
      );
    }

    props.setPodsArr([...toSortPods]);
  });

  useEffect(() => {
    props.getPodsAndContainers();
    // const podsInterval = setInterval(() => {
    //   props.getPodsAndContainers();
    // }, 15000);
    // return () => {
    //   clearInterval(podsInterval);
    // };
  }, []); // end of use effect to get pods info on page open

  //------------------------------------------------------------- END OF GET ALL POD INFO SECTION ---

  // -------------------------------------------------- beginning of expand pods section -----------

  const [sortedBy, setSortedBy] = useState("");
  const [sortedByDisplay, setSortedByDisplay] = useState("");

  const sortedByArray = [
    "",
    "podCpuPercent",
    "podMemoryPercent",
    "name",
    "namespace",
    "node",
  ];
  const sortedByDisplayArray = [
    "",
    "max cpu",
    "max memory",
    "name",
    "namespace",
    "node",
  ];

  function handleSort(event) {
    let tempPods = [...props.podsArr];
    sortIncrement += 1;
    let thisIndex = sortIncrement % 6;
    setSortedBy(sortedByArray[thisIndex]);
    setSortedByDisplay(sortedByDisplayArray[thisIndex]);

    if (sortedByDisplayArray[thisIndex] === "") {
      tempPods.sort((a, b) => a.index - b.index);
    } else if (sortedByDisplayArray[thisIndex] === "max cpu") {
      //reset to sorted by index
      tempPods.sort((a, b) => a.index - b.index);

      let numberArr = [];
      let stringArr = [];
      for (let k = 0; k < props.podsArr.length; k++) {
        if (typeof props.podsArr[k]["podCpuPercent"] === "number") {
          numberArr.push(props.podsArr[k]);
        } else stringArr.push(props.podsArr[k]);
      }
      numberArr.sort((a, b) => a["podCpuPercent"] - b["podCpuPercent"]);
      tempPods = [...stringArr, ...numberArr];
      tempPods.reverse();
    } else if (sortedByDisplayArray[thisIndex] === "max memory") {
      //reset to sorted by index
      tempPods.sort((a, b) => a.index - b.index);
      let numberArr = [];
      let stringArr = [];
      for (let k = 0; k < props.podsArr.length; k++) {
        if (typeof props.podsArr[k]["podMemoryPercent"] === "number") {
          numberArr.push(props.podsArr[k]);
        } else stringArr.push(props.podsArr[k]);
      }
      numberArr.sort((a, b) => a["podMemoryPercent"] - b["podMemoryPercent"]);
      tempPods = [...stringArr, ...numberArr];
      tempPods.reverse();
    } else {
      //reset to sorted by index
      tempPods.sort((a, b) => a.index - b.index);
      //sort by whatever other propery name alphabeticcaly
      tempPods.sort((a, b) =>
        a[sortedByArray[thisIndex]].localeCompare(b[sortedByArray[thisIndex]])
      );
    }

    props.setPodsArr([...tempPods]);
  }

  const [selectedPodContainers, setSelectedPodContainers] = useState([]);

  const handlePodOpen = (pod) => {
    if (pod["status"] === "Running") {
      props.setSelectedPodStatusColor("#2fc665");
      props.setSelectedPodStatusColorLight("#2fc665");
    } else {
      props.setSelectedPodStatusColor("rgba(210, 223, 61)");
      props.setSelectedPodStatusColorLight("rgba(210, 223, 61)");
    }
    props.setSelectedPod([pod]);

    if (typeof props.selectedPod[0]["podCpuPercent"] === "string") {
      if (props.selectedPod[0]["podCpuPercent"] === "N/A") {
        props.setSelectedPodCPUColor("#ffffff80");
        props.setSelectedPodCPUColorLight("#ffffff80");
      }
    } else if (props.selectedPod[0]["podCpuPercent"] < 90) {
      props.setSelectedPodCPUColor("#2fc665");
      props.setSelectedPodCPUColorLight("#2fc665");
    } else {
      props.setSelectedPodCPUColor("#cf4848");
      props.setSelectedPodCPUColorLight("#cf4848");
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
      let temp = "";
      let output = [];
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
    //send get pods o wide info commands
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
      let output = [];
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

    //send get container info commands
    ipcRenderer.send("podYaml_command", {
      podYamlCommand,
      currDir,
    });

    props.setOpenPodYaml(true);
  };

  const handlePodYamlClose = () => {
    props.setOpenPodYaml(false);
  };

  const handlePodDescribeOpen = (pod) => {
    ipcRenderer.on("podDescribeRetrieved", (event, arg) => {
      let argArr = arg.split("/n");
      let output = [];

      for (let i = 0; i < argArr.length; i++) {
        output.push(
          <pre>
            <span>{argArr[i]}</span>
          </pre>
        );
      }
      props.setPodDescribe(output);
    });

    let podDescribeCommand = `kubectl describe pod ${props.selectedPod[0]["name"]}`;
    //send get container info commands
    ipcRenderer.send("podDescribe_command", {
      podDescribeCommand,
      currDir,
    });

    props.setOpenPodDescribe(true);
  };

  const handlePodDescribeClose = () => {
    props.setOpenPodDescribe(false);
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

      props.getPodsAndContainers();

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

  function handleKubeSystemChange() {
    //check kubesystem's show/hide status and merge and sort kube system pods if false bc we dont change status until end of this function
    if (kubeSystemCheck === false) {
      let tempPods = [...props.podsArr, ...kubeSystemPods];
      tempPods.sort((a, b) => a.index - b.index);

      // after merging and sorting by index, check sortBy status and re-sort based on that
      if (sortedByDisplayArray[sortIncrement % 6] === "") {
        tempPods.sort((a, b) => a.index - b.index);
      } else if (sortedByDisplayArray[sortIncrement % 6] === "max cpu") {
        //reset to sorted by index
        tempPods.sort((a, b) => a.index - b.index);

        let numberArr = [];
        let stringArr = [];
        for (let k = 0; k < tempPods.length; k++) {
          if (typeof tempPods[k]["podCpuPercent"] === "number") {
            numberArr.push(tempPods[k]);
          } else stringArr.push(tempPods[k]);
        }
        numberArr.sort((a, b) => a["podCpuPercent"] - b["podCpuPercent"]);
        tempPods = [...stringArr, ...numberArr];
        tempPods.reverse();
      } else if (sortedByDisplayArray[sortIncrement % 6] === "max memory") {
        //reset to sorted by index
        tempPods.sort((a, b) => a.index - b.index);
        let numberArr = [];
        let stringArr = [];
        for (let k = 0; k < tempPods.length; k++) {
          if (typeof tempPods[k]["podMemoryPercent"] === "number") {
            numberArr.push(tempPods[k]);
          } else stringArr.push(tempPods[k]);
        }
        numberArr.sort((a, b) => a["podMemoryPercent"] - b["podMemoryPercent"]);
        tempPods = [...stringArr, ...numberArr];
        tempPods.reverse();
      } else {
        //reset to sorted by index
        tempPods.sort((a, b) => a.index - b.index);
        //sort by whatever other propery name alphabeticcaly
        tempPods.sort((a, b) =>
          a[sortedByArray[sortIncrement % 6]].localeCompare(
            b[sortedByArray[sortIncrement % 6]]
          )
        );
      }
      //after sorting set new podsArr
      props.setPodsArr([...tempPods]);
    } else {
      //if removing kube pods, first set them in separate array for ability to re-merge later
      let kubePods = props.podsArr.filter(
        (pod) => pod.namespace === "kube-system"
      );
      setKubeSystemPods([...kubePods]);
      //filter out kube system pods and set new podsArr
      let tempPods = props.podsArr.filter(
        (pod) => pod.namespace !== "kube-system"
      );
      props.setPodsArr([...tempPods]);
    }
    setKubeSystemCheck(!kubeSystemCheck);
  }

  //--------------------------------------------- end of expand pods section ---

  // ---------------------------------------------------------- START OF FOR LOOP TO CREATE EACH POD"S JSX --------
  let podsList = [];
  for (let i = 0; i < props.podsArr.length; i++) {
    let readyStatusRunning;
    let PodCpuPercentColor;
    let PodCpuPercentColorLight;
    let PodMemoryPercentColor;
    let PodMemoryPercentColorLight;

    if (props.podsArr[i]["status"] === "Running") {
      readyStatusRunning = "#5eba62";
    } else {
      readyStatusRunning = "rgba(210, 223, 61)";
    }

    if (props.podsArr[i]["podCpuPercent"] === "N/A") {
      PodCpuPercentColor = "#ffffff80";
      PodCpuPercentColorLight = "#00000040";
    } else if (
      props.podsArr[i]["podCpuPercent"] < 90 ||
      props.podsArr[i]["podCpuPercent"] === "" ||
      props.podsArr[i]["podCpuPercent"] === undefined
    ) {
      PodCpuPercentColor = "#2fc665";
      PodCpuPercentColorLight = "#5eba62";
    } else {
      PodCpuPercentColor = "#cf4848";
      PodCpuPercentColorLight = "#d35656";
    }

    if (props.podsArr[i]["podMemoryPercent"] === "N/A") {
      PodMemoryPercentColor = "#ffffff80";
      PodMemoryPercentColorLight = "#00000040";
    } else if (
      props.podsArr[i]["podMemoryPercent"] < 90 ||
      props.podsArr[i]["podMemoryPercent"] === "" ||
      props.podsArr[i]["podMemoryPercent"] === undefined
    ) {
      PodMemoryPercentColor = "#2fc665";
      PodMemoryPercentColorLight = "#5eba62";
    } else {
      PodMemoryPercentColor = "#cf4848";
      PodMemoryPercentColorLight = "#d35656";
    }

    podsList.push(
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
        POD {i + 1}
        <Button
          key={i}
          id="podButt"
          onClick={() => handlePodOpen(props.podsArr[i])}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "450px",
            height: "145px",
            fontSize: "16px",
            justifyContent: "space-around",
            textAlign: "left",
            alignItems: "space-between",
            margin: "2px 0 0 0",
            padding: "32px 0px 0px 0px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            border:
              theme.palette.mode === "dark"
                ? "1.3px solid white"
                : "1.3px solid #00000025",
            borderRadius: "5px",
            boxShadow:
              theme.palette.mode === "dark" ? "10px 9px 2px #00000060" : "",
            background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb80",
            cursor: "pointer",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: "40px", marginLeft: "0px" }}
              src="./assets/pod.svg"
            ></img>
            <span
              style={{
                margin: "0px 0 0 15px",
                width: "320px",
                lineHeight: "22px",
                textTransform: "none",
                fontSize: "17px",
              }}
            >
              {props.podsArr[i]["name"]}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                alignItems: "flex-end",
                justifyContent: "right",
                margin: "2px 0 0 0",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "15px",
                  backgroundColor: `${readyStatusRunning}`,
                  justifyContent: "right",
                  margin: "5px 0 2px 0",
                }}
              ></div>
              <div style={{ fontSize: "10px", color: `${readyStatusRunning}` }}>
                {props.podsArr[i]["ready"]}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  margin: "-4px 0 0 0",
                  color: `${readyStatusRunning}`,
                }}
              >
                {props.podsArr[i]["status"]}
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
                fontSize: "10.5px",
                padding: "0px 0px 0 0px",
                fontWeight: theme.palette.mode === "dark" ? "400" : "500",
                marginTop: "-2px",
                lineHeight: "13.5px",
                textTransform: "none",
                opacity: ".5",
                color: theme.palette.mode === "dark" ? "" : "#00000099",
              }}
            >
              {" "}
              NODE: {props.podsArr[i]["node"]}
              <br />
              NAMESPACE: {props.podsArr[i]["namespace"]}
              <br />
              CPU USAGE:{" "}
              {props.podsArr[i]["podCpuLimit"] === "NONE" ||
              props.podsArr[i]["podCpuLimit"] === ""
                ? `${props.podsArr[i]["podCpuUsed"]}m`
                : `${props.podsArr[i]["podCpuUsed"]}m / ${props.podsArr[i]["podCpuLimit"]}m`}
              <br />
              MEMORY USAGE:{" "}
              {props.podsArr[i]["podMemoryLimit"] === "NONE" ||
              props.podsArr[i]["podMemoryLimit"] === ""
                ? `${props.podsArr[i]["podMemoryUsedDisplay"]}`
                : `${props.podsArr[i]["podMemoryUsedDisplay"]} / ${props.podsArr[i]["podMemoryLimitDisplay"]}`}
              <br />
              RESTARTS/LAST: {props.podsArr[i]["restarts"]} (
              {props.podsArr[i]["lastRestart"]})
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
                  value={
                    props.podsArr[i]["podCpuLimit"] === "NONE"
                      ? 0
                      : Number(`${props.podsArr[i]["podCpuPercent"]}`) * 0.73
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
                    left: "9.5px",
                    rotate: "-131deg",
                    color:
                      theme.palette.mode === "dark"
                        ? `${PodCpuPercentColor}`
                        : `${PodCpuPercentColorLight}`,
                    width: "68px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-48px",
                  left: "5px",
                  fontSize: !props.podsArr[i]["podCpuLimit"]
                    ? "13px"
                    : props.podsArr[i]["podCpuLimit"] === "NONE"
                    ? "13px"
                    : "16px",
                  fontWeight: "500",
                  marginTop: !props.podsArr[i]["podCpuLimit"]
                    ? "-55px"
                    : props.podsArr[i]["podCpuLimit"] === "NONE"
                    ? "-55px"
                    : "-60px",
                  marginLeft:
                    props.podsArr[i]["podCpuLimit"] === "NONE"
                      ? "-10px"
                      : "-8px",
                  color:
                    theme.palette.mode === "dark"
                      ? `${PodCpuPercentColor}`
                      : `${PodCpuPercentColorLight}`,
                }}
              >
                {!props.podsArr[i]["podCpuLimit"]
                  ? "loading"
                  : props.podsArr[i]["podCpuLimit"] === "NONE"
                  ? `no max`
                  : `${props.podsArr[i]["podCpuPercent"]}%`}
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
                      ? `${PodCpuPercentColor}`
                      : `${PodCpuPercentColorLight}`,
                }}
              >
                CPU
              </div>
            </div>

            <LightTooltip
              title="Please note: Pod memory may exceed 100% as long as its node has available memory."
              placement="left"
              arrow
              enterDelay={1800}
              leaveDelay={100}
              enterNextDelay={3000}
            >
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
                      marginTop: "18px",
                      marginLeft: "9.5px",
                      rotate: "-131deg",
                      color:
                        theme.palette.mode === "dark"
                          ? "#ffffff40"
                          : "#00000015",
                      width: "68px",
                    }}
                  />
                  <CircularProgress
                    variant="determinate"
                    // @ts-nocheck
                    thickness={1.35}
                    value={
                      props.podsArr[i]["podMemoryLimit"] === "NONE"
                        ? 0
                        : Number(`${props.podsArr[i]["podMemoryPercent"]}`) *
                          0.73
                    }
                    style={{
                      position: "relative",
                      top: "-48.45px",
                      left: "8.5px",
                      rotate: "-131deg",
                      color:
                        theme.palette.mode === "dark"
                          ? `${PodMemoryPercentColor}`
                          : `${PodMemoryPercentColorLight}`,
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
                    marginLeft:
                      props.podsArr[i]["podMemoryPercent"] === "N/A"
                        ? "-11px"
                        : "-10px",
                    fontSize: !props.podsArr[i]["podMemoryLimit"]
                      ? "13px"
                      : props.podsArr[i]["podMemoryLimit"] === "NONE"
                      ? "13px"
                      : "16px",
                    marginTop: !props.podsArr[i]["podMemoryLimit"]
                      ? "-55px"
                      : props.podsArr[i]["podMemoryLimit"] === "NONE"
                      ? "-55px"
                      : "-60px",
                    color:
                      theme.palette.mode === "dark"
                        ? `${PodMemoryPercentColor}`
                        : `${PodMemoryPercentColorLight}`,
                  }}
                >
                  {!props.podsArr[i]["podMemoryLimit"]
                    ? "loading"
                    : props.podsArr[i]["podMemoryPercent"] === "N/A"
                    ? `no max`
                    : `${props.podsArr[i]["podMemoryPercent"]}%`}
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
                        ? `${PodMemoryPercentColor}`
                        : `${PodMemoryPercentColorLight}`,
                  }}
                >
                  MEMORY
                </div>
              </div>
            </LightTooltip>
          </span>
          {}
        </Button>
      </div>
    );
  } // end of for loop
  // ---------------------------------------- END OF FOR LOOP TO CREATE EACH POD"S JSX --------

  let podContainerList = [];
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
  let podListDiv;
  if (props.podsArr[0]) {
    podListDiv = (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            margin: "-10px 0 0 0px",
            width: "95.5%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex" }}>
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize: "24px",
                  fontWeight: "900",
                  letterSpacing: "3px",
                  textAlign: "left",
                  color: theme.palette.mode === "dark" ? "" : "#6d6fb4",
                  paddingTop: "15px",
                  paddingBottom: "5px",
                  userSelect: "none",
                  margin: "0 0 0 68px",
                }}
              >
                PODS
              </div>
              <div
                style={{
                  margin: "28px 0 0 8px",
                  fontSize: "12px",
                  userSelect: "none",
                }}
              >
                ( {podsList.length} total )
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginRight: "0px",
              }}
            >
              <Button
                onClick={handleSort}
                style={{
                  display: "flex",
                  fontSize: "9px",
                  fontWeight: "900",
                  letterSpacing: ".5px",
                  border: "1px solid",
                  height: "16px",
                  textAlign: "left",
                  color:
                    sortedByDisplay === "" && theme.palette.mode === "dark"
                      ? "#ffffff99"
                      : sortedByDisplay === "" && theme.palette.mode === "light"
                      ? "grey"
                      : "",
                  marginTop: "23px",
                  marginLeft: "0px",
                  marginRight: "2px",
                  padding: "8px 4px 8px 6px",
                  marginBottom: "14px",
                }}
              >
                SORT BY{" "}
                <SortIcon style={{ width: "12px", margin: "0 4px 0 3px" }} />{" "}
                {sortedByDisplay}
              </Button>
            </div>
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
              width: "95%",
              backgroundColor:
                theme.palette.mode === "dark" ? "#ffffff99" : "#6d6fb4",
              marginTop: "-7px",
            }}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "-3px 4.1% 0 0px",
          }}
        >
          <div style={{ display: "flex" }}> </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "-6px 0 0 50px",
          }}
        >
          {podsList}
          <Modal
            open={props.openPod}
            onClose={handlePodClose}
            style={{ overflow: "scroll", height: "100%" }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={openPodModalStyle}>
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
                          {props.selectedPod[0]["ready"].toUpperCase()}
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "500",
                            margin: "-4px 0 0 0",
                            color: `${props.selectedPodStatusColor}`,
                          }}
                        >
                          {props.selectedPod[0]["status"].toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        marginTop: "20px",
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
                          margin: "0px 0 0px 0px",
                          fontSize: "17px",
                          fontWeight: "300",
                          lineHeight: "29px",
                        }}
                      >
                        <div style={{ paddingLeft: "5px" }}>
                          <br />
                          <div style={{ fontSize: "20px" }}>
                            <b>
                              NODE: {" " + props.selectedPod[0]["node"]}
                              <br />
                              NAMESPACE:
                              {" " + props.selectedPod[0]["namespace"]}{" "}
                            </b>
                            <br />
                          </div>
                          <b>RESTARTS:</b>{" "}
                          {props.selectedPod[0]["restarts"].toUpperCase()}
                          <br />
                          <b>LAST RESTART:</b>{" "}
                          {props.selectedPod[0]["lastRestart"].toUpperCase()}
                          <br />
                          <b>AGE:</b>{" "}
                          {props.selectedPod[0]["age"].toUpperCase()}
                          <br />
                          <b>IP ADDRESS:</b>
                          {" " + props.selectedPod[0]["ipAddress"]}
                          <br />
                          <b>NOMINATED NODE:</b>
                          {" " + props.selectedPod[0]["nominatedNode"]}
                          <br />
                          <b>READINESS GATES:</b>
                          {" " + props.selectedPod[0]["readinessGates"]}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "510px",
                          height: "240px",
                          // border: "1px solid white",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "510px",
                            margin: "0 0 5px -25px",
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
                                props.selectedPod[0]["podCpuLimit"] === "NONE"
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
                                  props.selectedPod[0]["podCpuPercent"] ===
                                  "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
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
                                  props.selectedPod[0]["podCpuPercent"] ===
                                  "N/A"
                                    ? "32px"
                                    : "42px",
                                fontWeight: "800",
                                marginTop: "-60px",
                                marginLeft: "-37px",
                                color:
                                  props.selectedPod[0]["podCpuPercent"] ===
                                  "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {props.selectedPod[0]["podCpuPercent"] === "N/A"
                                ? `NO MAX`
                                : `${props.selectedPod[0]["podCpuPercent"]}%`}
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
                                  props.selectedPod[0]["podCpuPercent"] ===
                                  "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
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
                              // border: "1px solid white",
                              margin: "0 30px 0 0",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  props.selectedPod[0]["podCpuLimit"] === "NONE"
                                    ? "28px"
                                    : "28px",
                                fontWeight: "700",
                                margin: "0px 0 -10px 0",
                                color:
                                  props.selectedPod[0]["podCpuPercent"] ===
                                  "N/A"
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {props.selectedPod[0]["podCpuUsed"].toUpperCase()}
                              m{" "}
                            </div>
                            <div
                              style={{ color: "#ffffff80", fontSize: "12px" }}
                            >
                              {" "}
                              CPU USED{" "}
                            </div>
                            <div
                              style={{
                                fontSize:
                                  props.selectedPod[0]["podCpuLimit"] === "NONE"
                                    ? "20px"
                                    : "28px",
                                fontWeight: "700",
                                margin:
                                  props.selectedPod[0]["podCpuLimit"] === "NONE"
                                    ? "6px 0 -8px 0"
                                    : "0px 0 -10px 0",
                                color:
                                  props.selectedPod[0]["podCpuPercent"] ===
                                  "N/A"
                                    ? "#ffffff70"
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podCpuPercent"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {props.selectedPod[0]["podCpuLimit"] === "NONE"
                                ? "NONE"
                                : `${props.selectedPod[0][
                                    "podCpuLimit"
                                  ].toUpperCase()}m`}{" "}
                            </div>
                            <div
                              style={{ color: "#ffffff80", fontSize: "12px" }}
                            >
                              {" "}
                              CPU LIMIT{" "}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              borderRadius: "15px",
                              height: "93px",
                              border: "1.5px solid #ffffff50",
                            }}
                          >
                            <PodCpuChart
                              width={230}
                              height={90}
                              selectedPod={props.selectedPod}
                              podsStatsObj={podsStatsObj}
                            />
                          </div>
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
                                  props.selectedPod[0]["podMemoryPercent"] ===
                                  "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
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
                                  props.selectedPod[0]["podMemoryPercent"] ===
                                  "N/A"
                                    ? "32px"
                                    : "42px",
                                fontWeight: "800",
                                marginTop: "-60px",
                                marginLeft: "-37px",
                                color:
                                  props.selectedPod[0]["podMemoryPercent"] ===
                                  "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {props.selectedPod[0]["podMemoryPercent"] ===
                              "N/A"
                                ? `NO MAX`
                                : `${props.selectedPod[0]["podMemoryPercent"]}%`}
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
                                  props.selectedPod[0]["podMemoryPercent"] ===
                                  "N/A"
                                    ? "#ffffff80"
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
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
                                  props.selectedPod[0]["podMemoryLimit"] === "NONE"
                                    ? "28px"
                                    : "28px",
                                fontWeight: "700",
                                margin: "0px 0 -10px 0",
                                color:
                                  props.selectedPod[0]["podMemoryPercent"] ===
                                  "N/A"
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {
                                props.selectedPod[0]["podMemoryUsedDisplay"]
                              }{" "}
                            </div>
                            <div
                              style={{ color: "#ffffff80", fontSize: "12px" }}
                            >
                              {" "}
                              MEM USED{" "}
                            </div>
                            <div
                              style={{
                                fontSize:
                                  props.selectedPod[0]["podMemoryLimit"] === "NONE"
                                    ? "20px"
                                    : "28px",
                                fontWeight: "700",
                                margin:
                                  props.selectedPod[0]["podMemoryLimit"] === "NONE"
                                    ? "6px 0 -8px 0"
                                    : "0px 0 -10px 0",
                                color:
                                  props.selectedPod[0]["podMemoryPercent"] ===
                                  "N/A"
                                    ? "#ffffff70"
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) < 90
                                    ? `#2fc665`
                                    : Number(
                                        props.selectedPod[0]["podMemoryPercent"]
                                      ) > 90
                                    ? "#cf4848"
                                    : "yellow",
                              }}
                            >
                              {" "}
                              {props.selectedPod[0]["podMemoryLimitDisplay"] ===
                            ""
                              ? "NONE"
                              : props.selectedPod[0]["podMemoryLimitDisplay"]}{" "}
                            </div>
                            <div
                              style={{ color: "#ffffff80", fontSize: "12px" }}
                            >
                              {" "}
                              MEM LIMIT{" "}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              borderRadius: "15px",
                              height: "93px",
                              border: "1.5px solid #ffffff50",
                            }}
                          >
                            <PodMemoryChart
                              width={230}
                              height={90}
                              selectedPod={props.selectedPod}
                              podsStatsObj={podsStatsObj}
                            />
                          </div>
                        </div>
                      </div>

                      {/* <div
                        id="podMemoryGaugeLarge"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          transform: "scale(.7)",
                          // border:"1px solid pink",
                          margin: "-70px 0 0 0",
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
                            props.selectedPod[0]["podMemoryLimit"] === "NONE"
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
                              props.selectedPod[0]["podMemoryPercent"] === "N/A"
                                ? "#ffffff80"
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
                                  ) < 90
                                ? `#2fc665`
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
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
                              props.selectedPod[0]["podMemoryPercent"] === "N/A"
                                ? "36px"
                                : "38px",
                            fontWeight: "800",
                            marginTop: "-60px",
                            marginLeft: "-37px",
                            color:
                              props.selectedPod[0]["podMemoryPercent"] === "N/A"
                                ? "#ffffff80"
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
                                  ) < 90
                                ? `#2fc665`
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
                                  ) > 90
                                ? "#cf4848"
                                : "yellow",
                          }}
                        >
                          {props.selectedPod[0]["podMemoryPercent"] === "N/A"
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
                              props.selectedPod[0]["podMemoryPercent"] === "N/A"
                                ? "#ffffff80"
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
                                  ) < 90
                                ? `#2fc665`
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
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
                              props.selectedPod[0]["podMemoryPercent"] === "N/A"
                                ? "#ffffff80"
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
                                  ) < 90
                                ? `#2fc665`
                                : Number(
                                    props.selectedPod[0]["podMemoryPercent"]
                                  ) > 90
                                ? "#cf4848"
                                : "yellow",
                          }}
                        >
                          {" "}
                          MEM. USED:{" "}
                          <strong>
                            {props.selectedPod[0]["podMemoryUsedDisplay"]}
                          </strong>
                          <br />
                          MEM. LIMIT:{" "}
                          <strong>
                            {props.selectedPod[0]["podMemoryLimitDisplay"] ===
                            ""
                              ? "NONE"
                              : props.selectedPod[0]["podMemoryLimitDisplay"]}
                          </strong>
                        </div>
                      </div> */}
                    </div>
                    <div
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: "40px 0 0 0px",
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
                          VIEW POD LOGS
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
                        onClick={handlePodDescribeOpen}
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
                          DESCRIBE POD
                        </span>
                      </button>
                      <Modal
                        open={props.openPodDescribe}
                        onClose={handlePodDescribeClose}
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
                            POD DESCRIBE
                          </div>
                          {props.podDescribe}
                        </Box>
                      </Modal>

                      <button
                        className="button3D-pushable"
                        role="button"
                        onClick={handlePodDeleteOpen}
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
                            width: "790px",
                            background:
                              theme.palette.mode === "dark"
                                ? "hsl(239, 38%, 51%)"
                                : "hsl(263, 65%, 80%)",
                            fontSize: "16px",
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
                        POD'S CONTAINERS
                      </div>
                      <div
                        style={{
                          margin: "0px 0 2px 10px",
                          color: `${props.selectedPodStatusColor}`,
                          userSelect: "none",
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
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "#ffffff99"
                              : "#6d6fb4",
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
        <div style={{ height: "35px" }}></div>
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
          marginTop: "0px",
          marginBottom: "23px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div>{podListDiv}</div>
      </div>
    </>
  );
}

export default KranePodList;
