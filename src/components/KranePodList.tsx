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

  // ----------------------------------------- get pods info section ------------

  const [podsArr, setPodsArr] = useState([]);

  function handleClick(event) {
    setPodsArr(filteredPods);
    // console.log("launch is", launch);
    // console.log("podsArr IN HANDLECLICK FOR LAUNCH is", podsArr);
  }

  let podsArrOutput: any = [];

  //Listen to "get pods" return event and set pods array
  ipcRenderer.on("got_pods", (event, arg) => {
    let argArr = arg.split("");
    console.log("arg arr is", argArr);

    // console.log("argArr length is", argArr.length);

    let i: number = 0;

    //skips "namespace"
    while (arg[i] !== " ") {
      i++;
    }
    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips "name"
    while (arg[i] !== " ") {
      i++;
    }

    //skips spaces
    while (arg[i] === " ") {
      i++;
    }
    //skips "ready"
    while (arg[i] !== " ") {
      i++;
    }
    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips "status"
    while (arg[i] !== " ") {
      i++;
    }
    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips "restarts"
    while (arg[i] !== " ") {
      i++;
    }

    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips age
    while (arg[i] !== " ") {
      i++;
    }

    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips ip
    while (arg[i] !== " ") {
      i++;
    }
    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips address
    while (arg[i] !== " ") {
      i++;
    }
    //skips spaces
    while (arg[i] === " ") {
      i++;
    }
    //skips node
    while (arg[i] !== " ") {
      i++;
    }

    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips nominated
    while (arg[i] !== " ") {
      i++;
    }

    //skips spaces
    while (arg[i] === " ") {
      i++;
    }
    //skips node
    while (arg[i] !== " ") {
      i++;
    }

    //skips spaces
    while (arg[i] === " ") {
      i++;
    }

    //skips gates
    while (arg[i] !== "\n") {
      i++;
    }
    i++;
    // console.log("arg at i is", arg[i]);
    // console.log("i is", i);

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
      // console.log("name output is", nameOutput.join(""));
      // console.log("ip output is", ipOutput.join(""));
      // console.log("node output is", nodeOutput.join(""));
      // console.log("nominated output is", nominatedOutput.join(""));
      // console.log("readiness output is", readinessOutput.join(""));

      // console.log(" i is", i);

      let pod: any = {
        namespace: namespaceOutput.join(""),
        name: nameOutput.join(""),
        ready: readyOutput.join(""),
        status: statusOutput.join(""),
        restarts: restartsOutput.join(""),
        lastRestart: lastRestartOutput.join(""),
        age: ageOutput.join(""),
        podCpuUsed: "",
        podMemoryUsed: "",
        podCpuLimit: "",
        podMemoryLimit: "",
        ipAddress: ipOutput.join(""),
        node: nodeOutput.join(""),
        nominatedNode: nominatedOutput.join(""),
        readinessGates: readinessOutput.join(""),
      };

      // console.log(" POD is", pod);

      // pod.name = nameOutput.join("");
      // pod.ready = readyOutput.join("");
      // pod.status = statusOutput.join("");
      // pod.restarts = restartsOutput.join("");
      // pod.lastRestart = lastRestartOutput.join("");
      // pod.age = ageOutput.join("");

      podsArrOutput.push(pod);
    } // ---------  end of for loop

    filteredPods = podsArrOutput.filter(
      (ele: any, ind: number) =>
        ind === podsArrOutput.findIndex((elem) => elem.name === ele.name)
    );
    // console.log("filteredPods is", filteredPods);
    setPodsArr([...filteredPods]);
    // console.log("podsArr is", podsArr);
  }); // --------------------------end of ipc render to get all pods o wide info  -

  // ----------------------------------- Listen to "get cpuUsed" return event
  ipcRenderer.on("got_cpuUsed", (event, arg) => {
    // console.log("ARG ISSSSSS", arg);
    let argArr = arg.split("");
    // console.log("arg arr is", argArr);
    let podUsageArray = [];

    let pod = {};

    let i: number = 0;

    //skips "namespace"
    while (argArr[i] !== " ") {
      i++;
    }

    //skips spaces
    while (argArr[i] === " ") {
      i++;
    }

    //skips "name"
    while (argArr[i] !== " ") {
      i++;
    }

    //skips spaces
    while (argArr[i] === " ") {
      i++;
    }
    //skips "CPU(cores)"
    while (argArr[i] !== " ") {
      i++;
    }
    //skips spaces
    while (argArr[i] === " ") {
      i++;
    }

    //skips "memoery(bytes)"
    while (argArr[i] !== " ") {
      i++;
    }
    i += 4;
    // //for loop to put all pods in array of objects
    for (let j = 0; i < argArr.length; i++) {
      let podCpuUsedArr = [];
      let podMemoryUsedArr = [];

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
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
        podMemoryUsedArr.push("0");
      } else if (argArr[i] === "M") {
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
      // console.log(" podCpuUsedArr is ", podCpuUsedArr);
      // console.log(" podMemoryUsedArr is ", podMemoryUsedArr);
      //join used values and add them to object
      pod = {
        podCpuUsed: podCpuUsedArr.join(""),
        podMemoryUsed: podMemoryUsedArr.join(""),
      };

      j++;
      // console.log("after used values i is", i, "and arg i is", arg[i]);
      // console.log(" POD IS ", pod);
      podUsageArray.push(pod);
    } //end of for loop

    let finalPodUsageArr = podUsageArray.filter(
      (ele: any, ind: number) =>
        ind ===
        podUsageArray.findIndex(
          (elem) =>
            elem.podCpuUsed === ele.podCpuUsed &&
            elem.podMemoryUsed === ele.podMemoryUsed
        )
    );

    setPodsArr([...filteredPods]);
    // console.log("FINALPODSARR ISis", finalPodUsageArr);

    for (let j = 0; j < finalPodUsageArr.length; j++) {
      filteredPods[j]["podCpuUsed"] = finalPodUsageArr[j]["podCpuUsed"];
      filteredPods[j]["podMemoryUsed"] = finalPodUsageArr[j]["podMemoryUsed"];
    }
    // console.log("filtered pods is", filteredPods);
  }); // -------------------- end of ipc render function for get pods cpu used

  //Listen to "get cpuUsed" return event
  ipcRenderer.on("got_cpuLimits", (event, arg) => {
    // console.log("ARG ISSSSSS", arg);
    let argArr = arg.split("");
    // console.log("arg arr is", argArr);
    let podLimitsArray = [];

    let pod = {};

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
      let podCpuLimitsArr = [];
      let podMemoryLimitsArr = [];
      let podNameArr = [];

      //take name because maybe be duplicate values]
      while (argArr[i] !== " ") {
        podNameArr.push(argArr[i]);
        i++;
      }
      //skip spaces
      while (argArr[i] === " ") {
        i++;
      }

      // console.log("I IS:", i, " .... ARG ARRAY AT I IS:", argArr[i]);
      if (argArr[i] === "<") {
        podCpuLimitsArr = ["N", "O", "N", "E"];
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
          podCpuLimitsArr.push(argArr[i]);
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
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
        } else if (argArr[i] === "M") {
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
          podMemoryLimitsArr.push("0");
        }

        i += 3;
        // console.log("podMemoryLimitsArr is", podMemoryLimitsArr);
      }

      //   //join used values and add them to object
      pod = {
        podName: podNameArr.join(""),
        podCpuLimit: podCpuLimitsArr.join(""),
        podMemoryLimit: podMemoryLimitsArr.join(""),
      };

      j++;
      //   // console.log("after used values i is", i, "and arg i is", arg[i]);
      // console.log(" POD IS ", pod);
      podLimitsArray.push(pod);
      pod = {};
    } //end of for loop

    let lastPodsArr = podLimitsArray.filter(
      (ele: any, ind: number) =>
        ind === podLimitsArray.findIndex((elem) => elem.podName === ele.podName)
    );

    setPodsArr([...filteredPods]);
    // console.log("LAST PODS ARR LENGTH IS", lastPodsArr.length);

    for (let j = 0; j < lastPodsArr.length; j++) {
      let currentCpu = lastPodsArr[j]["podCpuLimit"];
      let currentMemory = lastPodsArr[j]["podMemoryLimit"];
      filteredPods[j]["podCpuLimit"] = currentCpu;
      filteredPods[j]["podMemoryLimit"] = currentMemory;

      filteredPods[j]["podCpuPercent"] = currentCpu;

      // let log = Number(filteredPods[j]["podCpuUsed"]);
      // console.log("filterd cpu limit is ", filteredPods[j]["podCpuLimit"]);
      // console.log(
      //   "filterd memory limit is ",
      //   filteredPods[j]["podMemoryLimit"]
      // );

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
            filteredPods[j]["podCpuPercent"] = temp;
          }
        }
      }

      if (currentMemory === "NONE") {
        filteredPods[j]["podMemoryPercent"] = "N/A";
      } else {
        let memoryUsed = Number(filteredPods[j]["podMemoryUsed"]);
        filteredPods[j]["podMemoryPercent"] = memoryUsed / currentMemory;
        if (filteredPods[j]["podMemoryPercent"] >= 1) {
          filteredPods[j]["podMemoryPercent"] = "100";
        } else {
          filteredPods[j]["podMemoryPercent"] =
            filteredPods[j]["podMemoryPercent"] * 100;
          if (filteredPods[j]["podMemoryPercent"] % 1 !== 0) {
            let temp = filteredPods[j]["podMemoryPercent"].toFixed(1);
            filteredPods[j]["podMemoryPercent"] = temp;
          }
        }
      }

      // // filteredPods[j]["podMemoryPercent"] =
      // //   Number(filteredPods[j]["podMemoryUsed"]) /
      // //   Number(filteredPods[j]["podMemoryLimit"]);

      // let percent = 0;

      // if (filteredPods[j]["podMemoryLimit"] === "NONE") {
      //   filteredPods[j]["podMemoryPercent"] = "N/A";
      // } else if (filteredPods[j]["podMemoryPercent"] >= 1) {
      //   filteredPods[j]["podMemoryPercent"] = 100;
      // } else
      //   filteredPods[j]["podMemoryPercent"] =
      //     Number(filteredPods[j]["podMemoryUsed"]) /
      //     Number(filteredPods[j]["podMemoryLimit"]);
    }
  }); //-------------------   end of ipc render function to get podcpu and memory limits

  useEffect(() => {
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
    }, 500);

    // ----------------------------------------------- Beginning of get pod cpu and memory limits section

    let cpuLimitsCommand = `kubectl get po --all-namespaces -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu",Memory-limit:"spec.containers[*].resources.limits.memory"`;
    setTimeout(() => {
      ipcRenderer.send("getCpuLimits_command", {
        cpuLimitsCommand,
        currDir,
      });
    }, 1000);

    // for (let i = 0; i < filteredPods.length; i++) {
    //   if (filteredPods[i]["podMemoryLimit"] === "NONE") {
    //     filteredPods[i]["podMemoryPercent"] = "N/A";
    //   } else if (filteredPods[i]["podMemoryPercent"] >= 1) {
    //     filteredPods[i]["podMemoryPercent"] = 100;
    //   } else
    //     filteredPods[i]["podMemoryPercent"] =
    //       Number(filteredPods[i]["podMemoryUsed"]) /
    //       Number(filteredPods[i]["podMemoryLimit"]);
    // }
    //final set of state
    // setPodsArr([...filteredPods]);
    // setPodsArr([...filteredPods]);
  }, []); // end of use effect

  //------------------------------------------------------------- END OF GET ALL POD INFO SECTION ---

  // console.log("launch2 is", launch);

  // console.log("podsArr at 2 is", podsArr);
  // console.log("podsArr 0 is", podsArr[0]);
  // console.log("typeof podsArr 0 is", typeof podsArr[0]);

  // console.log("filteredPods FINAL is", filteredPods);
  // console.log("final pods array is", podsArr);

  // -------------------------------------------------- beginning of expand pods section -----------

  const [openPod, setOpenPod] = React.useState(false);
  const [selectedPodCPUColor, setSelectedPodCPUColor] = useState("");
  const [selectedPodMemoryColor, setSelectedPodMemoryColor] = useState("");
  const [selectedPod, setSelectedPod] = useState([
    {
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
    },
  ]);

  const handleCommandOpen = (pod) => {
    setSelectedPod([pod]);
    // console.log("selected pod is ", pod);
    setOpenPod(true);
    // console.log("selected pod is ", pod);

    // console.log(
    //   `selectedPod[0]["podCpuPercent"] is`,
    //   selectedPod[0]["podCpuPercent"]
    // );
    if (typeof selectedPod[0]["podCpuPercent"] === "string") {
      if (selectedPod[0]["podCpuPercent"] === "N/A") {
        setSelectedPodCPUColor("#ffffff80");
      }
    } else if (selectedPod[0]["podCpuPercent"] < 90) {
      setSelectedPodCPUColor("#2fc665");
    } else {
      setSelectedPodCPUColor("#cf4848");
    }

    // console.log("selectedPodCpuColor is", selectedPodCPUColor);
  };

  const handleCommandClose = () => {
    setSelectedPod([
      {
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
      },
    ]);
    setOpenPod(false);
  };

  //--------------------------------------------- end of expand pods section ---

  // ---------------------------------------------------------- START OF FOR LOOP TO CREATE EACH POD"S JSX --------
  let podsList = [];
  for (let i = 0; i < podsArr.length; i++) {
    let readyStatusRunning;
    let PodCpuPercentColor;
    let PodMemoryPercentColor;
    let numerator = 0;
    let denominator = "";

    // let z = i;

    let current = podsArr[i]["ready"];
    current = current.split("");
    // console.log("current is", current);

    // let podsArrReadyLength = podsArr[i]["ready"].length;

    let curr;
    // while (current[j] !== "/") {
    // curr = current[j];

    //   let numerString = numerator.toString();
    //   numerator = Number((numerString += curr.concat()));
    // }

    for (let j = 0; current[j] !== "/"; j++) {
      curr = current[j];
      // console.log("curr is", curr);

      let numerString = numerator.toString();
      numerator = Number((numerString += curr.concat()));
    }

    // console.log("numerator is", Number(numerator));

    if (podsArr[i]["status"] === "Running") {
      readyStatusRunning = "#2fc665";
    } else {
      readyStatusRunning = "rgba(210, 223, 61)";
    }

    if (podsArr[i]["podCpuPercent"] === "N/A") {
      PodCpuPercentColor = "#ffffff80";
    } else if (podsArr[i]["podCpuPercent"] < 90) {
      PodCpuPercentColor = "#2fc665";
    } else {
      PodCpuPercentColor = "#cf4848";
    }

    if (podsArr[i]["podMemoryPercent"] === "N/A") {
      PodMemoryPercentColor = "#ffffff80";
    } else if (podsArr[i]["podMemoryPercent"] < 90) {
      PodMemoryPercentColor = "#2fc665";
    } else {
      PodMemoryPercentColor = "#cf4848";
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
        }}
      >
        POD {i + 1}
        <Button
          key={i}
          id="podButt"
          onClick={() => handleCommandOpen(podsArr[i])}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "450px",
            height: "145px",
            fontSize: "16px",
            // border: "1px solid white",
            justifyContent: "space-around",
            textAlign: "left",
            alignItems: "space-between",
            margin: "2px 0 0 0",
            padding: "35px 0px 0px 0px",
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img
              style={{ width: "40px", marginLeft: "0px" }}
              src="../../pod.svg"
            ></img>
            <span
              style={{
                margin: "5px 0 0 15px",
                width: "320px",
                lineHeight: "23px",
              }}
            >
              {podsArr[i]["name"].toUpperCase()}
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
                  backgroundColor: "#2fc665",
                  justifyContent: "right",
                  margin: "5px 0 2px 0",
                  // border: ".5px solid white",
                }}
              ></div>
              <div style={{ fontSize: "10px", color: `${readyStatusRunning}` }}>
                {podsArr[i]["ready"]}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  margin: "-4px 0 0 0",
                  color: `${readyStatusRunning}`,
                }}
              >
                {podsArr[i]["status"]}
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
                // border: "1px solid blue",
                lineHeight: "16px",
                textTransform: "none",
                opacity: ".5",
                // color: `${readyStatusRunning}`,
              }}
            >
              CPU USAGE:{" "}
              {podsArr[i]["podCpuLimit"] === "NONE" ||
              podsArr[i]["podCpuLimit"] === ""
                ? `${podsArr[i]["podCpuUsed"]}m`
                : `${podsArr[i]["podCpuUsed"]}m / ${podsArr[i]["podCpuLimit"]}m`}
              <br />
              MEMORY USAGE:{" "}
              {podsArr[i]["podMemoryLimit"] === "NONE" ||
              podsArr[i]["podMemoryLimit"] === ""
                ? `${podsArr[i]["podMemoryUsed"]}`
                : `${podsArr[i]["podMemoryUsed"]} / ${podsArr[i]["podMemoryLimit"]}`}
              <br />
              RESTARTS: {podsArr[i]["restarts"]}
              <br />
              LAST RESTART: {podsArr[i]["lastRestart"]}
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
                    color: "#ffffff40",

                    width: "68px",
                    // border: "1px solid red",
                    filter: "drop-shadow(10px 10px 10px #000000)",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={
                    podsArr[i]["podCpuLimit"] === "NONE"
                      ? 0
                      : Number(`${podsArr[i]["podCpuPercent"]}`) * 0.73
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
                    left: "9.5px",
                    rotate: "-131deg",
                    color: `${PodCpuPercentColor}`,

                    width: "68px",
                    // border: "1px solid red",
                    filter: "drop-shadow(10px 10px 10px #000000)",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-48px",
                  left: "5px",
                  fontSize:
                    podsArr[i]["podCpuLimit"] === "NONE" ? "13px" : "16px",
                  fontWeight: "500",
                  marginTop:
                    podsArr[i]["podCpuLimit"] === "NONE" ? "-55px" : "-60px",
                  marginLeft: "-8px",
                  // border: "2px solid red",
                  color: `${PodCpuPercentColor}`,
                }}
              >
                {podsArr[i]["podCpuLimit"] === "NONE"
                  ? `no max`
                  : `${podsArr[i]["podCpuPercent"]}%`}
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
                  color: `${PodCpuPercentColor}`,
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
                    marginTop: "18px",
                    marginLeft: "9.5px",
                    rotate: "-131deg",
                    color: "#ffffff40",

                    width: "68px",
                    // border: "1px solid red",
                    filter: "drop-shadow(10px 10px 10px #000000)",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  // @ts-nocheck
                  thickness={1.35}
                  value={
                    podsArr[i]["podMemoryLimit"] === "NONE"
                      ? 0
                      : Number(`${podsArr[i]["podMemoryPercent"]}`) * 0.73
                  }
                  style={{
                    position: "relative",
                    top: "-48px",
                    left: "8.5px",
                    rotate: "-131deg",
                    color: `${PodMemoryPercentColor}`,

                    width: "68px",
                    // border: "1px solid red",
                    filter: "drop-shadow(10px 10px 10px #000000)",
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
                  fontSize:
                    podsArr[i]["podMemoryLimit"] === "NONE" ? "13px" : "16px",
                  marginTop:
                    podsArr[i]["podMemoryLimit"] === "NONE" ? "-55px" : "-60px",
                  // border: "2px solid red",
                  color: `${PodMemoryPercentColor}`,
                }}
              >
                {podsArr[i]["podMemoryPercent"] === "N/A"
                  ? `no max`
                  : `${podsArr[i]["podMemoryPercent"]}%`}
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
                  color: `${PodMemoryPercentColor}`,
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
  } // end of for loop
  // ---------------------------------------------------------- END OF FOR LOOP TO CREATE EACH POD"S JSX --------

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let podListDiv;
  if (podsArr[0]) {
    podListDiv = (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "0 0 0 68px",
          }}
        >
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
            }}
          >
            PODS
            <Button
              style={{
                // fontFamily: "Outfit",
                fontSize: "9px",
                fontWeight: "900",
                letterSpacing: "2px",
                // border: "1px solid white",
                height: "5px",
                textAlign: "left",
                // color: "#ffffff99",
                marginTop: "5px",
                marginLeft: "10px",
              }}
            >
              SORT BY {}
            </Button>
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
              marginRight: "50px",
              marginTop: "10px",
              justifyContent: "flex-end",
              // paddingTop: "50px",
            }}
          >
            <div
              style={{
                marginTop: "5px",
              }}
            >
              <i> STATS AUTOMATICALLY REFRESH EVERY 30 SECONDS</i>
            </div>
            <Button
              style={{
                marginLeft: "10px",
                marginTop: "4px",
                letterSpacing: ".8px",
                // padding:"0 0 0 0",
                border: "1px solid #ffffff99",
                fontSize: "9px",
                width: "160px",
                // height:"100px",

                color: "#ffffff99",
              }}
              onClick={handleClick}
            >
              Refresh now
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
              backgroundColor: "#ffffff99",
              // border: "1px solid white",
              // marginRight: "50px",
              marginTop: "0px",
            }}
          ></div>
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", margin: "0 0 0 50px" }}
        >
          {podsList}
          <Modal
            open={openPod}
            onClose={handleCommandClose}
            style={{ overflow: "scroll", height: "100%" }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // border: "1px solid white",
                  }}
                >
                  <div style={{ width: "140px" }}>
                    <img
                      style={{ width: "100px", margin: "15px 25px 0 20px" }}
                      src="../../public/pod.svg"
                    ></img>
                  </div>
                  {"  "}
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "800",
                      letterSpacing: "1px",
                      padding: "10px 0 10px 10px",
                      // border: "1px solid yellow",
                      width: "900px",
                    }}
                  >
                    {selectedPod[0]["name"].toUpperCase()}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "right",
                      alignItems: "flex-end",
                      justifyContent: "right",
                      margin: "15px 15px 0 100px",
                      // border:"1px solid green",
                      // width:"200px"
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "15px",
                        backgroundColor: "#2fc665",
                        justifyContent: "right",
                        margin: "0px 0 2px 0",
                        // border: "5px solid white",
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "500",
                        // color: `${readyStatusRunning}`,
                      }}
                    >
                      {selectedPod[0]["ready"].toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "500",
                        margin: "-4px 0 0 0",
                        // color: `${readyStatusRunning}`,
                      }}
                    >
                      {selectedPod[0]["status"].toUpperCase()}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // border: "1px solid pink",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      flexDirection: "column",
                      width: "250px",
                      color: "#ffffff99",
                      // border: "2px solid green",
                    }}
                  >
                    <div style={{ paddingLeft: "40px" }}>
                      <br />
                      RESTARTS: {selectedPod[0]["restarts"].toUpperCase()}
                      <br />
                      LAST RESTART:{" "}
                      {selectedPod[0]["lastRestart"].toUpperCase()}
                      <br />
                      AGE: {selectedPod[0]["age"].toUpperCase()}
                      <br />
                      IP ADDRESS:
                      {" " + selectedPod[0]["ipAddress"]}
                      <br />
                      NODE:
                      {" " + selectedPod[0]["node"]}
                      <br />
                      NOMINATED NODE:
                      {" " + selectedPod[0]["nominatedNode"]}
                      <br />
                      READINESS GATES:
                      {" " + selectedPod[0]["readinessGates"]}
                    </div>
                  </div>
                  <div style={{ flexDirection: "column", width: "220px" }}>
                    <div style={{ paddingLeft: "20px", color: "#ffffff99" }}>
                      <br />
                      CPU USED: {selectedPod[0]["podCpuUsed"].toUpperCase()}m
                      <br />
                      CPU LIMIT: {selectedPod[0]["podCpuLimit"].toUpperCase()}m
                      <br />
                      CPU PERCENTAGE: {selectedPod[0]["podCpuPercent"]}%
                      <br />
                      MEMORY USED:{" "}
                      {selectedPod[0]["podMemoryUsed"].toUpperCase()}
                      Mi
                      <br />
                      MEMORY LIMIT:
                      {selectedPod[0]["podMemoryLimit"].toUpperCase()}Mi
                      <br />
                      MEMORY PERCENTAGE:{selectedPod[0]["podMemoryPercent"]}%
                    </div>{" "}
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
                        marginLeft: "95.5px",
                        rotate: "-131deg",
                        color: "#ffffff40",

                        width: "180px",
                        // border: "1px solid red",
                        filter: "drop-shadow(10px 10px 10px #000000)",
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      // @ts-nocheck
                      thickness={1.37}
                      value={
                        // 2 *
                        selectedPod[0]["podCpuLimit"] === "NONE"
                          ? 0
                          : Number(`${selectedPod[0]["podCpuPercent"]}`) * 0.73
                      }
                      style={{
                        position: "relative",
                        top: "-40px",
                        left: "48px",
                        rotate: "-131deg",
                        color:
                          selectedPod[0]["podCpuPercent"] === "N/A"
                            ? "#ffffff80"
                            : Number(selectedPod[0]["podCpuPercent"]) < 90
                            ? `#2fc665`
                            : Number(selectedPod[0]["podCpuPercent"]) > 90
                            ? "#cf4848"
                            : "yellow",
                        width: "180px",

                        // border: "1px solid red",
                        filter: "drop-shadow(10px 10px 10px #000000)",
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        top: "-100px",
                        left: "0px",
                        fontSize: "38px",
                        fontWeight: "800",
                        marginTop: "-60px",
                        marginLeft: "5px",
                        // border: "2px solid blue",
                        color:
                          selectedPod[0]["podCpuPercent"] === "N/A"
                            ? "#ffffff80"
                            : Number(selectedPod[0]["podCpuPercent"]) < 90
                            ? `#2fc665`
                            : Number(selectedPod[0]["podCpuPercent"]) > 90
                            ? "#cf4848"
                            : "yellow", //`${PodMemoryPercentColor}`,
                      }}
                    >
                      {selectedPod[0]["podCpuPercent"] === "N/A"
                        ? `no max`
                        : `${selectedPod[0]["podCpuPercent"]}%`}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        position: "relative",
                        top: "-104px",
                        left: "0px",
                        // border: "1px solid red",

                        marginRight: "-2px",
                        fontWeight: "400",
                        marginTop: "-8px",
                        color:
                          selectedPod[0]["podCpuPercent"] === "N/A"
                            ? "#ffffff80"
                            : Number(selectedPod[0]["podCpuPercent"]) < 90
                            ? `#2fc665`
                            : Number(selectedPod[0]["podCpuPercent"]) > 90
                            ? "#cf4848"
                            : "yellow", //"#cf4848", //`${PodMemoryPercentColor}`,
                      }}
                    >
                      CPU
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
                        marginLeft: "50.5px",
                        rotate: "-131deg",
                        color: "#ffffff40",

                        width: "180px",
                        // border: "1px solid red",
                        filter: "drop-shadow(10px 10px 10px #000000)",
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      // @ts-nocheck
                      thickness={1.35}
                      value={
                        // 95 *
                        selectedPod[0]["podMemoryLimit"] === "NONE"
                          ? 0
                          : Number(`${selectedPod[0]["podMemoryPercent"]}`) *
                            0.73
                      }
                      style={{
                        position: "relative",
                        top: "-40.2px",
                        left: "25px",
                        rotate: "-131deg",
                        color:
                          selectedPod[0]["podMemoryPercent"] === "N/A"
                            ? "#ffffff80"
                            : Number(selectedPod[0]["podMemoryPercent"]) < 90
                            ? `#2fc665`
                            : Number(selectedPod[0]["podMemoryPercent"]) > 90
                            ? "#cf4848"
                            : "yellow",

                        width: "180px",
                        // border: "1px solid red",
                        filter: "drop-shadow(10px 10px 10px #000000)",
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        top: "-100px",
                        left: "-15px",
                        fontSize: "38px",
                        fontWeight: "800",
                        marginTop: "-60px",
                        marginLeft: "-10px",
                        // border: "2px solid red",
                        color:
                          selectedPod[0]["podMemoryPercent"] === "N/A"
                            ? "#ffffff80"
                            : Number(selectedPod[0]["podMemoryPercent"]) < 90
                            ? `#2fc665`
                            : Number(selectedPod[0]["podMemoryPercent"]) > 90
                            ? "#cf4848"
                            : "yellow", //`${PodMemoryPercentColor}`,
                      }}
                    >
                      {/* 95% */}
                      {selectedPod[0]["podMemoryPercent"] === "N/A"
                        ? `no max`
                        : `${selectedPod[0]["podMemoryPercent"]}%`}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        position: "relative",
                        top: "-104px",
                        left: "-20px",
                        // border: "1px solid red",

                        marginRight: "-2px",
                        fontWeight: "400",
                        marginTop: "-8px",
                        color:
                          selectedPod[0]["podMemoryPercent"] === "N/A"
                            ? "#ffffff80"
                            : Number(selectedPod[0]["podMemoryPercent"]) < 90
                            ? `#2fc665`
                            : Number(selectedPod[0]["podMemoryPercent"]) > 90
                            ? "#cf4848"
                            : "yellow", //`${PodMemoryPercentColor}`,
                      }}
                    >
                      MEMORY
                    </div>
                  </div>
                </div>
                <div style={{ flexDirection: "row", margin: "0 0 0 40px" }}>
                  <Button
                    style={{
                      width: "200px",
                      border: "1px solid white",
                      fontSize: "14px",
                    }}
                  >
                    DELETE & RESTART POD
                  </Button>
                  <Button
                    style={{
                      width: "200px",
                      border: "1px solid white",
                      fontSize: "14px",
                      margin: "0 10px 0 30px",
                    }}
                  >
                    CHANGE NAMESPACE
                  </Button>
                  <Button
                    style={{
                      width: "200px",
                      border: "1px solid white",
                      fontSize: "14px",
                      margin: "0 10px 0 10px",
                    }}
                  >
                    VIEW LOGS
                  </Button>
                  <Button
                    style={{
                      width: "200px",
                      border: "1px solid white",
                      fontSize: "14px",
                      margin: "0 20px 0 10px",
                    }}
                  >
                    CHANGE LIMITS
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
        <div style={{ height: "35px" }}></div>
      </>
    );
  }

  // console.log("selected pod 3 is ", selectedPod);

  return (
    <>
      {/* ----------------MAIN CONTENT---------------- */}

      <div
        data-height="100%"
        // spacing={1}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflow: "hidden",
          alignItems: "flex-start",
          marginLeft: "0px",
          marginTop: "0px",
          marginBottom: "0px",
          textAlign: "center",
          width: "100%",
          // border: "1px solid red",
        }}
      >
        <div>{podListDiv}</div>
      </div>
    </>
  );
}

export default KranePodList;
