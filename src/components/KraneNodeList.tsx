import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, useTheme, Box, Modal } from "@mui/material";
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
  const [launch, setLaunch] = useState<boolean>(false);
  const [nodesArr, setnodesArr] = useState<Array<string>>([]);
  const [statusArr, setStatusArr] = useState<Array<string>>([]);
  const [roleArr, setRoleArr] = useState<Array<string>>([]);
  const [ageArr, setAgeArr] = useState<Array<string>>([]);
  const [versionArr, setVersionArr] = useState<Array<string>>([]);

  const theme = useTheme();

  let kraneCommand: string = "kubectl get nodes";
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

  useEffect(() => {
    // ----------------------------------------- get NODES section ------------

    //send krane command to get all nodes
    ipcRenderer.send("getNodes_command", {
      kraneCommand,
      currDir,
    });

    //Listen to "get nodes" return event
    ipcRenderer.on("got_nodes", (event, arg) => {
      let output: any = [];
      let statusOutput: any = [];
      let roleOutput: any = [];
      let ageOutput: any = [];
      let versionOutput: any = [];

      let i: number = 57;
      let argArr = arg.split();

      while (arg[i] !== " ") {
        output.push(arg[i]);
        i++;
      }
      setnodesArr([output]);
      i += 3;
      while (arg[i] !== " ") {
        statusOutput.push(arg[i]);
        i++;
      }
      setStatusArr([statusOutput]);

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        roleOutput.push(arg[i]);
        i++;
      }
      setRoleArr([roleOutput]);

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        ageOutput.push(arg[i]);
        i++;
      }
      setAgeArr([ageOutput]);

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " " && i < arg.length) {
        versionOutput.push(arg[i]);
        i++;
      }
      setVersionArr([versionOutput]);

      // console.log("arg is", arg);
    });
  }, []);

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let nodeListDiv = (
    <>
        <div
          style={{
            display: "flex",
            fontFamily: "Outfit",
            fontWeight: "400",
            fontSize: "17px",
            height: "auto",
            justifyContent: "center",
            overflow: "hidden",
            alignItems: "center",
            width: "auto",
            padding: "0px 10px 4px 20px",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "#8f85fb" : "#9075ea",
            textShadow:
              theme.palette.mode === "dark"
                ? "1px 1px 2px black"
                : "2px 2px 0px #00000000",
            // border: "1px solid red",
          }}
        >
          NODE 1
        </div>
        <Button
          id="nodeButt"
          style={{
            fontFamily: "Outfit",
            fontWeight: "200",
            fontSize: "14px",
            justifyContent: "center",
            alignItems: "center",
            width: "300px",
            padding: "10px 10px 10px 20px",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            border:
              theme.palette.mode === "dark"
                ? "1.2px solid white"
                : "1.2px solid #9075ea",
            borderRadius: "5px",
            boxShadow:
              theme.palette.mode === "dark"
                ? "10px 9px 2px #00000060"
                : "10px 10px 1px #00000020",
            backgroundColor:
              theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
          }}
        >
          <div
            style={{
              width: "500px",
              // border: "1px solid white",
              textAlign: "left",
              alignItems: "center",
            }}
          >
            Name: {nodesArr[0]}
            <br /> Status: {statusArr[0]}
            <br /> Role: {roleArr[0]}
            <br /> Age: {ageArr[0]}
            <br /> Version: {versionArr[0]}
          </div>
        </Button>
    </>
  );

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
          justifyContent: "center",
          overflow: "hidden",
          alignItems: "center",
          marginLeft: "0px",
          marginTop: "10px",
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
