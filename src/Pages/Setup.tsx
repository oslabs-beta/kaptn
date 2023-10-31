import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Autocomplete,
  OutlinedInput,
  ListItemText,
  Checkbox,
  Backdrop,
  useTheme,
  Modal,
  Typography,
} from "@mui/material";
import { Box, styled, lighten, darken } from "@mui/system";
import Grid from "@mui/system/Unstable_Grid";
import SetupCommandLine from "../components/SetupCommandLine.jsx";
import Terminal from "../components/Terminal.js";
import Sidebar from "../components/Sidebar.jsx";
import EastIcon from "@mui/icons-material/East";
import commands from "../components/commands.js";
import BoltIcon from "@mui/icons-material/Bolt";
import helpDesk from "../components/HelpDesk.jsx";
import Switch from "@mui/material/Switch";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarHalfIcon from "@mui/icons-material/StarHalf";
// import { makeStyles } from '@mui/material';

const { ipcRenderer } = require("electron");

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
    color: "white",
    fontSize: 11,
  },
}));

//section header (e.g. beginner, intermediate, etc) rules for grouped "command" option
const BeginnerHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  margin: "0px",
  color: "#ffffff",
  backgroundColor: "#352a68",
}));

//style for grouped commands
const GroupItems = styled("ul")({
  padding: 0,
  color: "#ffffff",
  backgroundColor: "#5c4d9a",
});

function Setup() {
  const [tool, setTool] = useState<string>("kubectl");
  const [verb, setVerb] = React.useState<string>("");
  const [type, setType] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [currDir, setCurrDir] = React.useState<string>("NONE SELECTED");
  const [shortDir, setShortDir] = React.useState<string>("NONE SELECTED");
  const [userInput, setUserInput] = React.useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [response, setResponse] = useState<
    Array<{ command: string; response: { [key: string]: string } }>
  >([]);
  const [yamlOpen, setYamlOpen] = React.useState<boolean>(false);
  const [imgPath, setImgPath] = useState<string>("NONE ENTERED");
  const [imgField, setImgField] = useState<string>("");
  const [flags, setFlags] = useState<Array<string>>([]);
  const [helpList, setHelpList] = useState<Array<string>>([""]);

  const [openCommand, setCommandOpen] = React.useState(false);
  const handleCommandOpen = () => setCommandOpen(true);
  const handleCommandClose = () => setCommandOpen(false);

  const [openType, setTypeOpen] = React.useState(false);
  const handleTypeOpen = () => setTypeOpen(true);
  const handleTypeClose = () => setTypeOpen(false);

  const [k8toolHover, setK8ToolHover] = useState<boolean>(false);
  const [checked, setChecked] = React.useState(true);

  //for light/dark mode toggle
  const theme = useTheme();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    bgcolor: theme.palette.mode === "dark" ? "#2c1b63" : "#e9e5fa",
    color: theme.palette.mode === "dark" ? "white" : "#47456e",
    boxShadow: 24,
    p: 4,
    padding: "10px",
    borderRadius: "5px",
  };

  //maps grouped command options alphabetically including if numbered
  const options = commands.map((option) => {
    const firstLetter = commands[0].category;
    return {
      firstLetter: /[{commands[0].category}]/.test(firstLetter)
        ? "0-9"
        : firstLetter,
      ...option,
    };
  });
  // handles updating img path updating and submission
  function keyPress(e) {
    e.preventDefault();
    if (e.key === "Enter") {
      setImgPath(e.target.value);
    }
  }
  // Set YAML modal box state
  const handleYamlClose = () => {
    setYamlOpen(false);
  };
  const handleYamlOpen = () => {
    setYamlOpen(true);
  };

  // Flag list options
  const flagList: string[] = [
    "-o wide",
    "--force",
    "-f",
    "-o default",
    "-A",
    "--all-namespaces",
    "-v",
    "-o json",
    "-o yaml",
  ];

  // Set flag list state
  const handleFlags = (event) => {
    const {
      target: { value },
    } = event;
    setFlags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  // handles name field changes
  const handleNameChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };

  const handleImgChange = (event) => {
    const {
      target: { value },
    } = event;
    setImgField(value);
  };

  // Set current work directory, and short directory (for its visible label)
  const handleUploadDirectory = (event) => {
    let path = event.target.files[0].path.split("");
    while (path[path.length - 1] !== "/") {
      path.pop();
    }
    let absPath = path.join("");
    setCurrDir(absPath);
    let absArr = absPath.split("");
    let shortArr = [];
    for (let i = absArr.length - 2; absArr[i] !== "/"; i--) {
      shortArr.unshift(absArr[i]);
    }
    shortArr.unshift("/");
    let shortPath = shortArr.join("") + "/";
    setShortDir("..." + shortPath);
  };
  //sets image submission
  const handleImgUpload = (e) => {
    e.preventDefault();
    setImgPath(imgField);
    setImgField("");
  };
  // updates img text field as typed
  const handleImgField = (e) => {
    setImgField(e.target.value);
  };

  // // Clear the input box
  // const handleClear = (e) => {
  //   e.preventDefault();
  //   setVerb('');
  //   setUserInput('');
  //   console.log(verb);
  // };

  // handle kubectl on off switch
  const handleK8ToolChange = (event) => {
    setChecked(event.target.checked);
    if (checked) setTool("");
    else setTool("kubectl");
  };

  let k8tool = "";
  if (checked === true) {
    k8tool = "ON";
  } else k8tool = "OFF";

  const toggleK8ToolHover = () => {
    let toolHoverStatus = !k8toolHover;
    setK8ToolHover(toolHoverStatus);
  };

  let k8toolStyle = {
    display: "flex",
    justifyContent: "flex-start",
    border:
      theme.palette.mode === "dark"
        ? ".1px solid #ffffff50"
        : ".1px solid #00000090",
    borderRadius: "3px",
    padding: "13px 0px 13px 8px",
    width: "135px",
  };
  if (k8toolHover && theme.palette.mode === "dark") {
    k8toolStyle = {
      display: "flex",
      justifyContent: "flex-start",
      border: "1px solid #ffffff",
      borderRadius: "3px",
      padding: "13px 0px 13px 7.5px",
      width: "135px",
    };
  } else if (k8toolHover && theme.palette.mode === "light") {
    k8toolStyle = {
      display: "flex",
      justifyContent: "flex-start",
      border: "1px solid #000000",
      borderRadius: "3px",
      padding: "13px 0px 13px 7.5px",
      width: "135px",
    };
  }

  // Set the command state based on current inputs
  useEffect(() => {
    ipcRenderer.on("post_command", (event, arg) => {
      const newResponseState = [
        ...response,
        { command: command, response: arg },
      ];
      setResponse(newResponseState);
    });

    let newCommand = "";
    if (tool !== "") newCommand += tool;
    if (verb !== "") newCommand += " " + verb;
    if (type !== "") newCommand += " " + type;
    if (name !== "") newCommand += " " + name;
    if (flags.length)
      flags.forEach((flag) => {
        newCommand += " " + flag;
      });
    if (userInput !== "") newCommand += " " + userInput;
    setCommand(newCommand);
  });

  // Handle the command input submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (tool === "" && currDir === "NONE SELECTED") {
      return alert("Please choose working directory");
    } else if (command === ` clear`) {
      setResponse([]);
    } else if (command.slice(0, 3) === " cd ") {
      let temp = command.slice(4, -1);
      console.log("temp:", temp);
      if (temp.slice(0, 2) === "../") {
        console.log("short dir is:", shortDir);
        console.log("CURR DIR IS:", currDir);
        //parse and change currDir and shortDir to one directory higher
      } else if (temp.slice(0, 2) === "./") {
        //ignore or slice and parse going down levels
        console.log("short dir is:", shortDir);
        console.log("CURR DIR IS:", currDir);
      }
    } else ipcRenderer.send("post_command", { command, currDir });
  };

  // Type options
  const types = [
    { label: "node" },
    { label: "nodes" },
    { label: "pod" },
    { label: "pods" },
    { label: "configmap" },
    { label: "deployment" },
    { label: "events" },
    { label: "rs" },
    { label: "replicaSets" },
    { label: "secret" },
    { label: "service" },
    { label: "services" },
  ];

  return (
    <>
      <Sidebar />
      {/* <Backdrop
        style={{
          color: "black",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          left: "0",
          right: "0",
          zIndex: "1349",
          width: "100%",
          height: "100%",
        }}
        open={yamlOpen}
        onClick={handleYamlClose}
      ></Backdrop> */}
      <div
        style={{
          position: "absolute",
          top: "58px",
          left: "60px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ---------   ---EASY SETUP COLUMN -------------- */}
        <div
          id="selections"
          style={{
            width: "225px",
            justifyContent: "center",
            alignContent: "flex-start",
          }}
        >
          {/* ----------EASY SETUP TITLE ------ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "8px",
              width: "100%",
              borderRadius: "5px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#2a2152" : "#c9c4f9",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Outfit",
                fontSize: "16px",
                fontWeight: "800",
                letterSpacing: "1px",
                color: theme.palette.mode === "dark" ? "White" : "#4e50a5",
              }}
            >
              EASY SETUP
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "15px",
              width: "100%",
              borderRadius: "5px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#2a2152" : "#c9c4f9",
              marginBottom: "18px",
            }}
          >
            {/* --------------------------- IMAGE CREATION SECTION --------------------- */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: theme.palette.mode === "dark" ? "#9e9d9d" : "black",
                paddingBottom: "10px",
                fontSize: "10.5px",
              }}
            >
              1. IMPORT IMAGE
            </div>
            <div
              style={{
                backgroundColor: "#716a8e",
                width: "90%",
                height: "1px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "5px",
                fontSize: "9px",
              }}
            ></div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
                fontSize: "9px",
              }}
            >
              {imgPath}
            </div>
            <Box
              sx={{
                "& > :not(style)": { m: 1, width: "160px" },
              }}
            >
              {" "}
              <form onSubmit={handleImgUpload}>
                <TextField
                  id="outlined-basic"
                  label="Enter .IMG"
                  value={imgField}
                  variant="outlined"
                  onChange={(e) => handleImgField(e)}
                />
              </form>
            </Box>
          </div>
          {/* ------------------- CHOOSE DIRECTORY SECTION ---------------------------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "5px",
              width: "100%",
              borderRadius: "5px",
              bgcolor: theme.palette.mode === "dark" ? "#2a2152" : "#c9c4f9",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: theme.palette.mode === "dark" ? "#9e9d9d" : "black",
                paddingBottom: "10px",
                fontSize: "10.5px",
                marginTop: "10px",
              }}
            >
              2. CHOOSE WORKING DIRECTORY
            </div>
            <div
              style={{
                backgroundColor: "#716a8e",
                width: "170px",
                height: "1px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
                fontSize: "9px",
              }}
            >
              {shortDir}
            </div>

            <Button
              variant="contained"
              component="label"
              style={{
                border: "1px solid white",
                width: "170px",
                marginBottom: "15px",
                fontSize: "12px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
              }}
            >
              CHOOSE DIRECTORY
              <input
                type="file"
                // @ts-expect-error
                directory=""
                webkitdirectory=""
                hidden
                onChange={handleUploadDirectory}
              />
            </Button>
          </Box>
          {/* ------------------------- CREATE YAML SECTION  ------------------------------- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // colored box behind buttons
              bgcolor: theme.palette.mode === "dark" ? "#2a2152" : "#c9c4f9",
              padding: "15px",
              width: "100%",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: theme.palette.mode === "dark" ? "#9e9d9d" : "black",
                paddingBottom: "10px",
                fontSize: "10.5px",
              }}
            >
              3. CHOOSE/CREATE YAML FILE
            </div>
            <div
              style={{
                backgroundColor: "#716a8e",
                width: "170px",
                height: "1px",
              }}
            />

            <Button
              onClick={handleYamlOpen}
              style={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                border: "1px solid white",
                width: "170px",
                marginBottom: "15px",
                fontSize: "12px",
              }}
            >
              Configure .YAML FILE
            </Button>
            {/* ----------- Backdrop is greyed out background during popup ----------------- */}
            <Backdrop
              style={{
                color: "black",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: "0",
                right: "0",
                zIndex: "1349",
                width: "100%",
                height: "100%",
              }}
              open={yamlOpen}
              onClick={handleYamlClose}
            >
              {/* ------- Paper is modal / popup --------------------------------------- */}
              <Paper
                onClick={handleYamlClose}
                style={{
                  height: "80%",
                  width: "87%",
                  backgroundColor: "white",
                  overflow: "scroll",
                  color: "black",
                  paddingLeft: "-10px",
                  zIndex: "1350",
                  position: "fixed",
                  top: "80px",
                  left: "65px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                color="black"
              >
                <div
                  style={{
                    width: "900px",
                    alignItems: "center",
                    marginLeft: "25px",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      width: "100%",
                      paddingTop: "20px",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      color: "#6466b2",
                    }}
                  >
                    PLEASE USE THE TOOL BELOW TO CREATE YOUR .YAML FILE
                  </div>
                  <div
                    style={{
                      font: "Roboto",
                      fontSize: "14px",
                      fontWeight: "500",
                      width: "100%",
                      paddingBottom: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      color: "grey",
                    }}
                  >
                    Once you've finished, use the copy clipboard button in the
                    top right corner. <br />
                    Then click in the blank space on either side of the popup to
                    close it, and continue following the instructions in the
                    learning center.
                  </div>

                  <iframe
                    id="yaml"
                    src="https://k8syaml.com"
                    width="900px"
                    height="900px"
                    style={{ alignItems: "center" }}
                  ></iframe>
                </div>
              </Paper>
            </Backdrop>
          </Box>
        </div>
        {/* --------------- STEP 4 INPUT COMMANDS --- TEXT ONLY -- SECTION ---------- */}
      </div>
      {/* ------------------ START OF TERMINAL COLUMN-------- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "58px 25px 0 0",
          paddingBottom: "0px",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent: "flex-start",
          width: "99%",
        }}
      >
        <div
          style={{
            height: "56vh",
            width: "70%",
            marginBottom: "20px",
            marginLeft: "310px",
          }}
        >
          <Terminal response={response} setResponse={setResponse} />
        </div>
        <div
          style={{
            // border: '1px solid',
            borderRadius: "3px",
            // background:
            //   theme.palette.mode === 'dark' ? '#0e0727' : '#e6e1fb',
            // border: '2px solid #c6bebe',
            height: "60px",
            width: "70.5%",
            marginTop: "-5px",
            marginBottom: "10px",
            marginLeft: "310px",
            marginRight: "0px",
            fontFamily: "monospace",
            padding: "0px",
            zIndex: "100",
          }}
        >
          <SetupCommandLine
            handleSubmit={handleSubmit}
            setUserInput={setUserInput}
            setVerb={setVerb}
            setType={setType}
            setName={setName}
            setFlags={setFlags}
            userInput={userInput}
            command={command}
            setCommand={setCommand}
            border="0px transparent"
            shortDir={shortDir}
            handleUploadDirectory={handleUploadDirectory}
          />
        </div>

        {/* ----------------INPUTS SECTION---------------- */}

        <div
          id="inputs"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "98.5%",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "30px",
              marginRight: "30px",
              width: "335px",
            }}
          >
            <div
              style={{
                justifyContent: "center",
                alignItems: "start",
                fontFamily: "Outfit",
                fontSize: "19px",
                marginLeft: "50px",
                paddingBottom: "15px",
                color: theme.palette.mode === "dark" ? "White" : "#4e50a5",
              }}
            >
              INPUT COMMANDS
            </div>
            <EastIcon
              style={{
                marginLeft: "5px",
                height: "30px",
                paddingBottom: "15px",
                color: theme.palette.mode === "dark" ? "White" : "#4e50a5",
              }}
            />
          </div>
          <div
            id="inputs"
            style={{
              display: "flex",
              flexDirection: "row",
              width: "95%",
              marginTop: "0px",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <LightTooltip
              title="If using kubectl commands, keep this on. If using other or global commands, turn this off."
              placement="top"
              arrow
              enterDelay={1800}
              leaveDelay={100}
              enterNextDelay={3000}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  id="k8tool"
                  style={k8toolStyle}
                  onMouseEnter={toggleK8ToolHover}
                  onMouseLeave={toggleK8ToolHover}
                >
                  <div
                    onClick={() => {
                      if (tool === "kubectl") {
                        setTool("");
                        setChecked(!checked);
                      } else setTool("kubectl");
                      setChecked(!checked);
                    }}
                    style={{
                      padding: "0px 4px 0 6px",
                      fontSize: "15px",
                      color:
                        theme.palette.mode === "dark" && k8tool === "ON"
                          ? "white"
                          : theme.palette.mode === "dark" && k8tool === "OFF"
                          ? "#ffffff99"
                          : theme.palette.mode === "light" && k8tool === "ON"
                          ? "#3f42c3"
                          : "#00000082",
                      letterSpacing: "-.2px",
                      WebkitUserSelect: "none" /* Safari */,
                      MozUserSelect: "none" /* Firefox */,
                      msUserSelect: "none" /* IE10+/Edge */,
                      userSelect: "none",
                    }}
                  >
                    kubectl
                  </div>
                  <Switch
                    size="small"
                    checked={checked}
                    onChange={handleK8ToolChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <div
                    onClick={() => {
                      if (tool === "kubectl") {
                        setTool("");
                        setChecked(!checked);
                      } else setTool("kubectl");
                      setChecked(!checked);
                    }}
                    style={{
                      padding: "4.5px 1px 0 1px",
                      fontSize: "10px",
                      color:
                        k8tool === "OFF" && theme.palette.mode === "light"
                          ? "grey"
                          : k8tool === "ON" && theme.palette.mode === "light"
                          ? ""
                          : k8tool === "OFF" && theme.palette.mode === "dark"
                          ? "#ffffff99"
                          : "",
                      WebkitUserSelect: "none" /* Safari */,
                      MozUserSelect: "none" /* Firefox */,
                      msUserSelect: "none" /* IE10+/Edge */,
                      userSelect: "none",
                    }}
                  >
                    {k8tool}
                  </div>
                </div>

                <div
                  style={{
                    height: "15px",
                    padding: "5px 0 0 0",
                  }}
                >
                  {helpDesk.hasOwnProperty(verb) ? "" : ""}
                </div>
              </div>
            </LightTooltip>
            {/* ---------------- COMMANDS FIELD ------------------------------------- */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "25%",
              }}
            >
              <div id="commands" style={{ margin: "0 5px 0 5px" }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={options.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  )}
                  groupBy={(option) => option.category}
                  getOptionLabel={(option) => option.title}
                  onInputChange={(e, newInputValue) => {
                    setVerb(newInputValue);
                    const newCommand = verb + " " + type + " " + name;
                    setCommand(newCommand);
                    setHelpList([newInputValue, type]);
                    // setCommand(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Commands" />
                  )}
                  renderGroup={(params) => (
                    <li
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                      }}
                      key={params.key}
                    >
                      <BeginnerHeader
                        style={{
                          color: "#ffffff",
                          fontSize: "14px",
                        }}
                      >
                        {params.group}
                      </BeginnerHeader>
                      <GroupItems
                        style={{
                          color: "#ffffff",
                          fontSize: "14px",
                        }}
                      >
                        {params.children}
                      </GroupItems>
                    </li>
                  )}
                />
              </div>
              <Button
                onClick={handleCommandOpen}
                style={{
                  display: "flex",
                  height: "15px",
                  padding: "15px 0 0 0",
                  justifyContent: "center",
                  textTransform: "uppercase",
                  fontWeight: "900",
                }}
              >
                {helpDesk.hasOwnProperty(verb) ? (
                  <>
                    <BoltIcon fontSize="small" /> INSTANT HELP{" "}
                    <BoltIcon fontSize="small" />
                  </>
                ) : (
                  ""
                )}
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
                      top: "0",
                      left: "0",
                      overflow: "auto",
                      height: "100%",
                      width: "100%",
                      paddingLeft: "20px",
                      zIndex: "1350",
                    }}
                    sx={{ mt: 0 }}
                  >
                    <pre
                      style={{
                        fontFamily: "Outfit,monospace",
                        fontSize: "24px",
                        overflow: "auto",
                      }}
                    >
                      Kubetcl{"  "}
                      <strong style={{ fontSize: "38px" }}>{verb}</strong> :
                    </pre>
                    <pre
                      style={{
                        fontSize: "14px",
                        overflow: "auto",
                      }}
                    >
                      {helpDesk[`${verb}`]}
                    </pre>
                  </Typography>
                </Box>
              </Modal>
            </div>

            {/* ---------------- TYPES FIELD ------------------------------------- */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "19%",
              }}
            >
              <div id="types" style={{}}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={types}
                  componentsProps={{
                    paper: {
                      sx: { backgroundColor: "#5c4d9a", color: "white" },
                    },
                  }}
                  onInputChange={(e, newInputValue) => {
                    setHelpList([verb, newInputValue]);
                    setType(newInputValue);
                    // setHelpList([verb, newInputValue]);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Types" />
                  )}
                />
              </div>
              <Button
                onClick={handleTypeOpen}
                style={{
                  display: "flex",
                  height: "15px",
                  padding: "15px 0 0 0",
                  justifyContent: "center",
                  textTransform: "uppercase",
                  fontWeight: "900",
                }}
              >
                {helpDesk.hasOwnProperty(type) ? (
                  <>
                    <BoltIcon fontSize="small" /> INSTANT HELP{" "}
                    <BoltIcon fontSize="small" />
                  </>
                ) : (
                  ""
                )}
              </Button>
              <Modal
                open={openType}
                onClose={handleTypeClose}
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
                      top: "0",
                      left: "0",
                      overflow: "auto",
                      height: "100%",
                      width: "100%",
                      paddingLeft: "20px",
                      zIndex: "1350",
                    }}
                    sx={{ mt: 0 }}
                  >
                    <pre
                      style={{
                        fontFamily: "Outfit,monospace",
                        fontSize: "24px",
                        overflow: "auto",
                      }}
                    >
                      Kubetcl Type: {"  "}
                      <strong style={{ fontSize: "38px" }}>{type}</strong>
                    </pre>
                    <pre
                      style={{
                        fontSize: "14px",
                        overflow: "auto",
                      }}
                    >
                      {helpDesk[`${type}`]}
                    </pre>
                  </Typography>
                </Box>
              </Modal>
            </div>

            {/* ---------------- NAMES FIELD ------------------------------------- */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "32%",
              }}
            >
              <div id="name" style={{ margin: "0 5px 0 5px" }}>
                <form
                  onChange={handleNameChange}
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    style={{ width: "100%" }}
                  />
                </form>
              </div>
              <div style={{ height: "15px", padding: "5px 0 0 0" }}>
                {helpDesk.hasOwnProperty(verb) ? "" : ""}
              </div>
            </div>

            {/* ---------------- FLAGS DROPDOWN ------------------------------------- */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "12%",
              }}
            >
              <div id="flag" style={{ marginLeft: "0px" }}>
                <FormControl fullWidth>
                  <InputLabel id="flag-label">Flags</InputLabel>
                  <Select
                    labelId="flag-label"
                    id="flag-label"
                    multiple
                    value={flags}
                    onChange={handleFlags}
                    input={<OutlinedInput label="Flags" />}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {flagList.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={{
                          backgroundColor: "#5c4d9a",
                          color: "white",
                        }}
                      >
                        <Checkbox checked={flags.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ height: "15px", padding: "5px 0 0 0" }}>
                {helpDesk.hasOwnProperty(verb) ? "" : ""}
              </div>
            </div>
          </div>
        </div>
        {/* ------ INSTANT HELP SECTION ----- */}

        <div
          style={{
            position: "absolute",
            left: "310px",
            bottom: "22px",
            display: "flex",
            flexDirection: "column",
            height: "105px",
            width: "69%",
            backgroundColor:
              theme.palette.mode === "dark" ? "#2f2f6d" : "#e1dbfe",
            // marginLeft: '0px',
            // marginTop: '25px',
            borderRadius: "3px",
            textAlign: "center",
            padding: "5px 0 0 0px",
            margin: "5px 0 0 0px",
            fontFamily: "Outfit",
            fontWeight: "900",
            letterSpacing: "1px",
            alignItems: "flex-start",
            fontSize: "18px",
            color: theme.palette.mode === "dark" ? "white" : "#4e50a5",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: ".5px solid white",
              padding: "0 0 10px 14px",
              width: "100%",
              height: "33px",
              justifyContent: "space-between",
            }}
          >
            LEARNING CENTER:
            <div
              style={{
                fontSize: "9px",
                fontFamily: "Roboto",
                fontWeight: "400",
                margin: "8px 1.8% 0 15%",
                lineHeight: "13px",
              }}
            >
              <em>
                ( CLICK ON ANY LINK BELOW FOR TUTORIALS AND LEARNING RESOURCES )
              </em>
            </div>
          </div>
          <div
            style={{
              overflow: "scroll",
              overflowX: "hidden",
              width: "100%",
              height: "100%",
              alignItems: "start",
            }}
          >
            {" "}
            <div
              style={{
                display: "flex",
                padding: "1px 10px 0px 15px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#22225a" : "#c8bef7",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                }}
              >
                <a
                  href="https://kubernetes.io/docs/tutorials/hello-minikube/"
                  target="blank"
                >
                  <strong>MINIKUBE TUTORIAL (Ideal for first timers) </strong> -
                  Follow along with Kubernetes official tutorial
                </a>
              </div>
              <div style={{ marginLeft: "68px", justifyContent: "flex-end" }}>
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "0px 10px 0px 15px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                }}
              >
                <a
                  href="https://www.youtube.com/watch?v=s_o8dwzRlu4&themeRefresh=1"
                  target="blank"
                >
                  <strong>CRASH COURSE FOR BEGINNERS (1-hour)</strong> - Follow
                  this hands-on tutorial with Nana from TechWorld
                </a>
              </div>
              <div style={{ marginLeft: "80px", justifyContent: "flex-end" }}>
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "0px 10px 0px 15px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#22225a" : "#c8bef7",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                }}
              >
                <a
                  href="https://www.youtube.com/watch?v=d6WC5n9G_sM"
                  target="blank"
                >
                  <strong>FULL BEGINNERS TUTORIAL (3-hours)</strong> - Follow
                  this full tutorial from freeCodeCamp.org
                </a>
              </div>
              <div style={{ marginLeft: "100px", justifyContent: "flex-end" }}>
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "0px 10px 0px 15px",
                flexDirection: "row",
                justifyContent: "space-between",

                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                }}
              >
                <a
                  href="https://kubernetes.io/docs/tutorials/kubernetes-basics/"
                  target="blank"
                >
                  <strong>LEARN KUBERNETES BASICS (kubernetes.io)</strong> -
                  Learn the basics about clusters, deployments & more
                </a>
              </div>
              <div style={{ marginLeft: "61px", justifyContent: "flex-end" }}>
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarOutlineIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "0px 10px 0px 15px",
                flexDirection: "row",
                justifyContent: "space-between",

                alignItems: "center",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#22225a" : "#c8bef7",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                }}
              >
                <a href="https://kubernetes.io/docs/tutorials/" target="blank">
                  <strong>MISC. KUBERNETES TUTORIALS (kubernetes.io)</strong> -
                  Learn about Configuration, stateful sets & more
                </a>
              </div>
              <div style={{ marginLeft: "43px", justifyContent: "flex-end" }}>
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarOutlineIcon fontSize="small" />
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Setup;
