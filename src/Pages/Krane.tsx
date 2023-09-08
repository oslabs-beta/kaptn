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
};

let filteredPods: any = [];

function Krane() {
  const [launch, setLaunch] = useState<boolean>(false);
  const [nodesArr, setnodesArr] = useState<Array<string>>([]);
  const [statusArr, setStatusArr] = useState<Array<string>>([]);
  const [roleArr, setRoleArr] = useState<Array<string>>([]);
  const [ageArr, setAgeArr] = useState<Array<string>>([]);
  const [versionArr, setVersionArr] = useState<Array<string>>([]);

  const theme = useTheme();

  const [openCommand, setCommandOpen] = React.useState(false);
  const handleCommandOpen = () => setCommandOpen(true);
  const handleCommandClose = () => setCommandOpen(false);

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

      console.log("arg is", arg);
    });
  }, []);

  // ----------------------------------------- get pods section ------------

  let podsCommand = "kubectl get pods";
  const [podsArr, setPodsArr] = useState([]);

  function handleClick(event) {
    setLaunch(true);
    setPodsArr(filteredPods);
    console.log("launch is", launch);
    console.log("podsArr is", podsArr);
  }

  useEffect(() => {
    //send krane command to get all nodes
    ipcRenderer.send("getPods_command", {
      podsCommand,
      currDir,
    });

    let podsArrOutput: any = [];

    //Listen to "get nodes" return event
    ipcRenderer.on("got_pods", (event, arg) => {
      let argArr = arg.split("");

      console.log("argArr length is", argArr.length);

      let i: number = 0;

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
      i += 4;

      //for loop to put all pods in array of objects
      for (let j = 0; i < argArr.length; i++) {
        let nameOutput: any = [];
        let readyOutput: any = [];
        let statusOutput: any = [];
        let restartsOutput: any = [];
        let lastRestartOutput: any = [];
        let ageOutput: any = [];

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
          ageOutput = ["0", "d"];
          i++;
        } else {
          //save age
          while (
            arg[i] === "d" ||
            arg[i] === "h" ||
            arg[i] === "m" ||
            arg[i] === "s" ||
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

        let pod: any = {
          name: nameOutput.join(""),
          ready: readyOutput.join(""),
          status: statusOutput.join(""),
          restarts: restartsOutput.join(""),
          lastRestart: lastRestartOutput.join(""),
          age: ageOutput.join(""),
        };

        // pod.name = nameOutput.join("");
        // pod.ready = readyOutput.join("");
        // pod.status = statusOutput.join("");
        // pod.restarts = restartsOutput.join("");
        // pod.lastRestart = lastRestartOutput.join("");
        // pod.age = ageOutput.join("");

        podsArrOutput.push(pod);
      }

      filteredPods = podsArrOutput.filter(
        (ele: any, ind: number) =>
          ind === podsArrOutput.findIndex((elem) => elem.name === ele.name)
      );
      console.log("filteredPods is", filteredPods);
      setPodsArr([...filteredPods]);
      console.log("podsArr is", podsArr);
    });
    setPodsArr([...filteredPods]);
    setPodsArr([...filteredPods]);
  }, []);

  console.log("launch2 is", launch);

  console.log("podsArr at 2 is", podsArr);
  console.log("podsArr 0 is", podsArr[0]);
  console.log("typeof podsArr 0 is", typeof podsArr[0]);

  let podsList = [];
  for (let i = 0; i < podsArr.length; i++) {
    podsList.push(
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Outfit",
            fontWeight: "900",
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
            onClick={handleCommandOpen}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "450px",
              height: "140px",
              fontSize: "16px",
              // border: "1px solid white",
              justifyContent: "space-between",
              textAlign: "left",
              alignItems: "center",
              margin: "0px 0 0 0",
              padding: "10px 0px 10px 15px",
              color: theme.palette.mode === "dark" ? "white" : "grey",
              border:
                theme.palette.mode === "dark"
                  ? "1.5px solid white"
                  : "1.5px solid #9075ea",
              borderRadius: "5px",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "10px 9px 2px #00000060"
                  : "10px 10px 1px #00000020",
              background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
            }}
          >
            {" "}
            {podsArr[i]["name"].toUpperCase()}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                // border: "1px solid white",
                justifyContent: "flex-start",
                textAlign: "left",
                alignItems: "space-between",
                // border:"2px solid red"
              }}
            >
              <div
                id="podsSmallStat"
                style={{ width: "90px", padding: "0 0 0 0px" }}
              >
                Ready: <br />
                {podsArr[i]["ready"]}
              </div>
              <br />
              <div id="podsSmallStat" style={{ width: "90px" }}>
                Status: <br /> {podsArr[i]["status"]}
              </div>
              <br />
              <div id="podsSmallStat" style={{ width: "90px" }}>
                Restarts: <br />
                {podsArr[i]["restarts"]}
              </div>
              <br />
              <div id="podsSmallStat" style={{ width: "90px" }}>
                Last Restart: <br /> {podsArr[i]["lastRestart"]}
              </div>
              <br />
              <div id="podsSmallStat" style={{ width: "90px" }}>
                {" "}
                Age: <br />
                {podsArr[i]["age"]}
              </div>
            </div>
            {}
          </Button>
          <Modal
            open={openCommand}
            onClose={handleCommandClose}
            style={{ overflow: "scroll", height: "100%" }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                // variant='h6'
                // component='h2'
              ></Typography>
              <Typography
                id="modal-modal-description"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  top: "0",
                  left: "0",
                  overflow: "auto",
                  height: "100%",
                  width: "100%",
                  paddingLeft: "20px",
                  zIndex: "1350",

                  // border:"2px solid red"
                }}
                sx={{ mt: 0 }}
              >
                {"  "}
                <strong
                  style={{
                    fontSize: "28px",
                    letterSpacing: "1px",
                    padding: "10px 0 0 0px",
                  }}
                >
                  {podsArr[i]["name"].toUpperCase()}
                  <br />
                </strong>
                <br />
                READY: {podsArr[i]["ready"].toUpperCase()}
                <br />
                STATUS: {podsArr[i]["status"].toUpperCase()}
                <br />
                RESTARTS: {podsArr[i]["restarts"].toUpperCase()}
                <br />
                LAST RESTART: {podsArr[i]["lastRestart"].toUpperCase()}
                <br />
                AGE: {podsArr[i]["age"].toUpperCase()}
                <pre
                  style={{
                    fontSize: "14px",
                    overflow: "auto",
                  }}
                ></pre>
              </Typography>
            </Box>
          </Modal>
        </div>
      </>
    );
  }

  let mainDiv;
  if (launch === false) {
    mainDiv = (
      <>
        <Button style={{ fontSize: "18px" }} onClick={handleClick}>
          CLICK HERE TO LAUNCH YOUR NODES AND PODS
        </Button>
      </>
    );
  } else {
    mainDiv = (
      <>
        <div
          style={{
            display: "flex",
            fontFamily: "Outfit",
            fontWeight: "900",
            fontSize: "17px",
            height: "auto",
            justifyContent: "center",
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
            fontWeight: "400",
            fontSize: "14px",
            justifyContent: "center",
            alignItems: "center",
            width: "300px",
            padding: "10px 10px 10px 20px",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
            border:
              theme.palette.mode === "dark"
                ? "1.5px solid white"
                : "1.5px solid #9075ea",
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
        <div
          style={{ display: "flex", flexWrap: "wrap", margin: "0 0 0 50px" }}
        >
          {podsList}
        </div>
        <div style={{height:"35px"}}></div>
      </>
    );
  }

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
          overflowY: "hidden",
          alignItems: "center",
          marginLeft: "0px",
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
    </>
  );
}

export default Krane;
