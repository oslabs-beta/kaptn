import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Typography, useTheme } from "@mui/material";
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

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
    color: "white",
    fontSize: 11,
  },
}));

function Krane() {
  const [nodesArr, setnodesArr] = useState<Array<string>>([]);
  const [statusArr, setStatusArr] = useState<Array<string>>([]);
  const [roleArr, setRoleArr] = useState<Array<string>>([]);
  const [ageArr, setAgeArr] = useState<Array<string>>([]);
  const [versionArr, setVersionArr] = useState<Array<string>>([]);

  let kraneCommand: string = "kubectl get nodes";
  let currDir = "NONE SELECTED";

  useEffect(() => {
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

      console.log("arg is", arg);
    });
  }, []);

  let podsCommand = "kubectl get pods";
  const [podsArr, setPodsArr] = useState<Array<string>>([]);
  const [podsStatusArr, setPodsStatusArr] = useState<Array<string>>([]);
  const [podsReadyArr, setPodsReadyArr] = useState<Array<string>>([]);
  const [podsRestartsArr, setPodsRestartsArr] = useState<Array<string>>([]);
  const [podsLastRestartArr, setPodsLastRestartArr] = useState<Array<string>>(
    []
  );
  const [podsAgeArr, setPodsAgeArr] = useState<Array<string>>([]);
  const [podsVersionArr, setPodsVersionArr] = useState<Array<string>>([]);

  useEffect(() => {
    //send krane command to get all nodes
    ipcRenderer.send("getPods_command", {
      podsCommand,
      currDir,
    });

    //Listen to "get nodes" return event
    ipcRenderer.on("got_pods", (event, arg) => {
      let podsNameOutput: any = [];
      let readyOutput: any = [];
      let statusOutput: any = [];
      let restartsOutput: any = [];
      let lastRestartOutput: any = [];
      let runningTimeOutput: any = [];
      let ageOutput: any = [];
      let versionOutput: any = [];

      let i: number = 9;
      console.log("arg at 0 is", arg);

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        i++;
      }
      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        i++;
      }

      while (arg[i] === " ") {
        i++;
      }
      i += 3;
      while (arg[i] !== " ") {
        podsNameOutput.push(arg[i]);
        i++;
      }
      setPodsArr([podsNameOutput]);

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        readyOutput.push(arg[i]);
        i++;
      }
      setPodsReadyArr([readyOutput]);

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        statusOutput.push(arg[i]);
        i++;
      }
      setPodsStatusArr([statusOutput]);

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== " ") {
        restartsOutput.push(arg[i]);
        i++;
      }
      setPodsRestartsArr([restartsOutput]);
      i += 2;

      while (arg[i] !== ")") {
        lastRestartOutput.push(arg[i]);
        i++;
      }
      setPodsLastRestartArr([lastRestartOutput]);
      i++;

      while (arg[i] === " ") {
        i++;
      }

      while (arg[i] !== "d" && i < arg.length) {
        ageOutput.push(arg[i]);
        i++;
      }
      ageOutput.push(arg[i]);
      setPodsAgeArr([ageOutput]);

      console.log("arg is", arg);
    });
  }, []);

  const theme = useTheme();

  return (
    <>
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
          alignItems: "center",
          marginLeft: ".8%",
          marginTop: "5%",
          textAlign: "center",
          width: "100%",
          // border: "1px solid red",
        }}
      >
        <div
          style={{
            fontFamily: "Outfit",
            fontWeight: "800",
            fontSize: "43px",
            justifyContent: "flex-start",

            alignItems: "center",
            width: "100%",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "#6466b2",
            // border: "1px solid pink",
          }}
        >
          KAPTN KRANE
        </div>
        <div
          style={{
            // fontFamily: 'Outfit',
            fontWeight: "400",
            fontSize: "14px",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "40px",
            width: "100%",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            // border: "1px solid green",
          }}
        >
          MANAGE YOUR CLUSTERS AND CONTAINERS
        </div>

        <div
          style={{
            // fontFamily: 'Outfit',
            fontWeight: "400",
            fontSize: "14px",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
            padding: "5px 10px 10px 20px",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            border:
              theme.palette.mode === "dark"
                ? "1px solid white"
                : "1px solid purple",
            borderRadius: "5px",
          }}
        >
          Node 1
          <div
            style={{
              width: "500px",
              // border: "1px solid white",
              textAlign: "left",
              alignItems: "center",
            }}
          >
            Node: {nodesArr[0]}
            <br /> Status: {statusArr[0]}
            <br /> Role: {roleArr[0]}
            <br /> Age: {ageArr[0]}
            <br /> Version: {versionArr[0]}
          </div>
        </div>
        <div
          style={{
            // fontFamily: 'Outfit',
            fontWeight: "400",
            fontSize: "14px",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
            margin: "20px 0 0 0",
            padding: "5px 0px 10px 20px",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            border:
              theme.palette.mode === "dark"
                ? "1px solid white"
                : "1px solid purple",
            borderRadius: "5px",
          }}
        >
          Pod 1
          <div
            style={{
              width: "600px",
              // border: "1px solid white",
              textAlign: "left",
              alignItems: "center",
            }}
          >
            Pod Name: {podsArr[0]}
            <br /> Pod Replicas Ready: {podsReadyArr[0]}
            <br /> Status: {podsStatusArr[0]}
            <br /> Restarts: {podsRestartsArr[0]}
            <br /> Last Restart: {podsLastRestartArr[0]}
            <br /> Total Time Running: {podsAgeArr[0]}
          </div>
        </div>
      </div>
    </>
  );
}

export default Krane;
