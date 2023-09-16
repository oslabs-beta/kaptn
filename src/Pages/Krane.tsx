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
  const [launch, setLaunch] = useState<boolean>(false);
  const [podsArr, setPodsArr] = useState([]);

  let podsCommand = "kubectl get pods";

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
    setLaunch(true);
    setPodsArr(filteredPods);
    // console.log("launch is", launch);
    // console.log("podsArr IN HANDLECLICK FOR LAUNCH is", podsArr);
  }

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let mainDiv;
  if (launch !== true) {
    mainDiv = (
      <>
        <Button
          style={{
            border: "1px solid",
            margin: "50px 0 0 0",
            padding: "0 20px 0 20px",
            height: "60px",
            fontSize: "16px",
            color: "white",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
          }}
          onClick={handleClick}
        >
          VIEW YOUR NODES AND PODS
        </Button>
      </>
    );
  } else {
    mainDiv = (
      <>
        <KraneNodeList />
        <KranePodList />
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
            marginTop: "50px",
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
              fontSize: "43px",
              justifyContent: "flex-start",

              overflowY: "hidden",
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
              marginBottom: "10px",
              width: "100%",
              letterSpacing: "1px",
              color: theme.palette.mode === "dark" ? "white" : "grey",
              // border: "1px solid green",
            }}
          >
            MANAGE YOUR CLUSTERS AND CONTAINERS
          </div>
          <div>{mainDiv}</div>
        </div>
      </div>
    </>
  );
}

export default Krane;
