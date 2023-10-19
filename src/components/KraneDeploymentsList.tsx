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

function KraneDeploymentsList(props) {
  const theme = useTheme();

  let currDir = props.currDir;

  //Listen to "get deployments" return event and set pods array
  ipcRenderer.on("got_deployments", (event, arg) => {
    let argArr = arg.split("");
    console.log("argArr is", argArr);

    let filteredDeployments = [];

    let i: number = 0;

    //skip row of column titles
    while (arg[i] !== "\n") {
      i++;
    }
    i++;

    for (let j = 0; i < argArr.length; i++) {
      let nameOutput: any = [];
      let readyOutput: any = [];
      let upToDateOutput: any = [];
      let availableOutput: any = [];
      let ageOutput: any = [];
      let containersOutput: any = [];
      let imagesOutput: any = [];
      let selectorOutput: any = [];

      //saves name
      while (arg[i] !== " ") {
        nameOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves ready
      while (arg[i] !== " ") {
        readyOutput.push(arg[i]);
        i++;
      }

      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves up-to-date
      while (arg[i] !== " ") {
        upToDateOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves available
      while (arg[i] !== " ") {
        availableOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves age
      while (arg[i] !== " ") {
        ageOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves containers
      while (arg[i] !== " ") {
        containersOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves images
      while (arg[i] !== " ") {
        imagesOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves selector
      while (arg[i] !== "\n") {
        selectorOutput.push(arg[i]);
        i++;
      }

      let deployment = {
        index: j,
        name: nameOutput.join(""),
        ready: readyOutput.join(""),
        upToDate: upToDateOutput.join(""),
        available: availableOutput.join(""),
        age: ageOutput.join(""),
        containers: containersOutput.join(""),
        images: imagesOutput.join(""),
        selector: selectorOutput.join(""),
        replicaSets: [],
      };

      filteredDeployments.push(deployment);
      j++;
    } //end of for loop parsing deployments return
    props.setDeploymentsArr(filteredDeployments);
    // console.log("deployments Arr is:", deploymentsArr);
  }); //--------------------------------------end of ipc to parse deployments --------

  //Listen to "get replicaSets" return event and set pods array
  ipcRenderer.on("got_rs", (event, arg) => {
    let argArr = arg.split("");
    // console.log("argArr RS is", argArr);

    let filteredReplicaSets = [];

    let i: number = 0;

    //skip row of column titles
    while (arg[i] !== "\n") {
      i++;
    }
    i++;

    for (let j = 0; i < argArr.length; i++) {
      let nameOutput: any = [];
      let desiredOutput: any = [];
      let currentOutput: any = [];
      let availableOutput: any = [];
      let ageOutput: any = [];
      let containersOutput: any = [];
      let imagesOutput: any = [];
      let selectorOutput: any = [];

      //saves name
      while (arg[i] !== " ") {
        nameOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves desired
      while (arg[i] !== " ") {
        desiredOutput.push(arg[i]);
        i++;
      }

      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves current
      while (arg[i] !== " ") {
        currentOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves available
      while (arg[i] !== " ") {
        availableOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves age
      while (arg[i] !== " ") {
        ageOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }
      //saves containers
      while (arg[i] !== " ") {
        containersOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves images
      while (arg[i] !== " ") {
        imagesOutput.push(arg[i]);
        i++;
      }
      //skips spaces
      while (arg[i] === " ") {
        i++;
      }

      //saves selector
      while (arg[i] !== "\n") {
        selectorOutput.push(arg[i]);
        i++;
      }

      let replicaSet = {
        index: j,
        name: nameOutput.join(""),
        desired: desiredOutput.join(""),
        current: currentOutput.join(""),
        available: availableOutput.join(""),
        age: ageOutput.join(""),
        containers: containersOutput.join(""),
        images: imagesOutput.join(""),
        selector: selectorOutput.join(""),
      };

      filteredReplicaSets.push(replicaSet);
      j++;
    } //end of for loop parsing replicaSets return

    //add each replicaSet to its deployment
    let tempDeploys = [...props.deploymentsArr];
    for (let i = 0; i < tempDeploys.length; i++) {
      tempDeploys[i]["replicaSets"] = filteredReplicaSets[i];
    }

    //set new deployments Arr state
    props.setDeploymentsArr(tempDeploys);
    console.log("deployments Arr is:", props.deploymentsArr);
  }); //--------------------------------------end of ipc to parse replicaSets --------

  useEffect(() => {
    props.getDeploymentsInfo();
  }, []);

  let deploymentsList = [];
  for (let i = 0; i < props.deploymentsArr.length; i++) {
    deploymentsList.push(
      <>
        <div>BLAH</div>
      </>
    );
  }

  let deploymentsListDiv;
  deploymentsListDiv = (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "-10px 0 0 68px",
          height: "34px",
          width: "250%",
          // border: "1px solid red",
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
              // border: "1px solid white",
              textAlign: "left",
              // color: "#ffffff",
              paddingTop: "0px",
              color: theme.palette.mode === "dark" ? "" : "#6d6fb4",
              userSelect: "none",
            }}
          >
            DEPLOYMENTS
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
            ( {props.deploymentsArr.length} total )
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
            // border: "1px solid green",
            // marginRight: "50px",
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
        <div>{deploymentsList}</div>
      </div>
    </>
  );

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
          marginTop: "-18px",
          marginBottom: "50px",
          textAlign: "center",
          width: "95.5%",
          // border: "1px solid green",
        }}
      >
        <div>{deploymentsListDiv}</div>
      </div>
    </>
  );
}

export default KraneDeploymentsList;
