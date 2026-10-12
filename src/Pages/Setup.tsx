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
import { Box, styled } from "@mui/system";
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
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

import { ipcRenderer } from "../electron-ipc";

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
  const isDark = theme.palette.mode === "dark";

  // Shared lavender design tokens, matched to the Krane + Cluster pages so the
  // Easy Setup page reads as part of the same modern system. Everything here is
  // presentation only — no behavior, wiring, or layout position changes.
  const ui = {
    titleColor: isDark ? "#ffffff" : "#4e50a5",
    titleCardBg: isDark
      ? "linear-gradient(135deg, #322863 0%, #241c4e 100%)"
      : "linear-gradient(135deg, #d4cffb 0%, #c3bdf7 100%)",
    cardBg: isDark ? "#2a2152" : "#c9c4f9",
    cardBorder: isDark ? "1px solid #ffffff14" : "1px solid #ffffffcc",
    cardShadow: isDark
      ? "0 8px 20px rgba(0,0,0,0.30)"
      : "0 8px 18px rgba(100,102,178,0.18)",
    stepLabel: isDark ? "#a79fd6" : "#5a57a3",
    accent: isDark ? "#8f85fb" : "#6c63d8",
    divider: isDark ? "#ffffff1f" : "#ffffffcc",
    chipBg: isDark ? "#1b1440" : "#ded9fb",
    chipText: isDark ? "#9a93c8" : "#6f6aa6",
    chipBorder: isDark ? "1px solid #ffffff14" : "1px solid #ffffff",
    btnBg: isDark ? "#150f2d" : "#8881ce",
    btnBorder: isDark ? "1px solid #6b5fe0" : "1px solid #ffffff",
    link: isDark ? "#b7aefc" : "#4b3fce",
    sectionLabel: isDark ? "#ffffff" : "#4e50a5",
    learnBg: isDark ? "#241c4e" : "#e1dbfe",
    learnBorder: isDark ? "1px solid #ffffff14" : "1px solid #ffffff",
    learnRowAlt: isDark ? "#2e2663" : "#d3ccf7",
    star: isDark ? "#8f85fb" : "#6c63d8",
  };

  // Reusable card shell for the three setup steps. Kept vertically tight so the
  // whole left column clears the INPUT COMMANDS row beneath the terminal.
  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 12px",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "11px",
    backgroundColor: ui.cardBg,
    border: ui.cardBorder,
    boxShadow: ui.cardShadow,
    marginBottom: "9px",
  };

  // Icon + exact step label (kept as one text node so the label text is intact).
  const stepLabelRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: ui.stepLabel,
    fontFamily: "Outfit",
    fontSize: "11.5px",
    fontWeight: 600,
    letterSpacing: "0.6px",
    marginBottom: "7px",
  };

  const dividerStyle: React.CSSProperties = {
    width: "100%",
    height: "1px",
    background: ui.divider,
  };

  // Monospace "path" chip for the chosen image / directory.
  const pathChip: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "10px",
    letterSpacing: "0.2px",
    color: ui.chipText,
    background: ui.chipBg,
    border: ui.chipBorder,
    borderRadius: "7px",
    padding: "4px 9px",
    margin: "7px 0",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  // Primary action button, matched to the Krane / Cluster button styling.
  const primaryBtn: React.CSSProperties = {
    backgroundColor: ui.btnBg,
    color: "white",
    border: ui.btnBorder,
    borderRadius: "9px",
    width: "100%",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    padding: "8px 0",
    textTransform: "none",
    boxShadow: "none",
  };

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
    borderRadius: "12px",
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
    while (path.length > 0 && path[path.length - 1] !== "/") {
      path.pop();
    }
    let absPath = path.join("");
    setCurrDir(absPath);
    let absArr = absPath.split("");
    let shortArr = [];
    for (let i = absArr.length - 2; i >= 0 && absArr[i] !== "/"; i--) {
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

  // Modernized kubectl on/off pill (rounded, lavender outline). Hover brightens
  // the border; behavior (the Switch + click handlers) is unchanged.
  let k8toolStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    border: isDark ? "1px solid #ffffff33" : "1px solid #00000030",
    borderRadius: "9px",
    padding: "12px 0px 12px 8px",
    width: "135px",
    transition: "border-color 160ms ease",
  };
  if (k8toolHover && isDark) {
    k8toolStyle = { ...k8toolStyle, border: "1px solid #8f85fb" };
  } else if (k8toolHover && !isDark) {
    k8toolStyle = { ...k8toolStyle, border: "1px solid #6c63d8" };
  }

  // Set the command state based on current inputs
  useEffect(() => {
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
      // } else if (command.slice(0, 3) === " cd ") {
      //   let temp = command.slice(4, -1);
      //   if (temp.slice(0, 2) === "../") {
      //     console.log("short dir is:", shortDir);
      //     console.log("CURR DIR IS:", currDir);
      //     //parse and change currDir and shortDir to one directory higher
      //   } else if (temp.slice(0, 2) === "./") {
      //     //ignore or slice and parse going down levels
      //     console.log("short dir is:", shortDir);
      //     console.log("CURR DIR IS:", currDir);
      //   }
    } else {
      // Register a one-shot response listener only when a command is actually
      // run, so listeners never accumulate (no MaxListenersExceededWarning).
      ipcRenderer.once("post_command", (event, arg) => {
        setResponse((prev) => [...prev, { command, response: arg }]);
      });
      ipcRenderer.send("post_command", { command, currDir });
    }
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
      ></Backdrop>
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
            width: "208px",
            justifyContent: "center",
            alignContent: "flex-start",
          }}
        >
          {/* ----------EASY SETUP TITLE ------ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "9px",
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "11px",
              background: ui.titleCardBg,
              border: ui.cardBorder,
              boxShadow: ui.cardShadow,
              marginBottom: "11px",
            }}
          >
            <AutoFixHighIcon style={{ fontSize: "20px", color: ui.accent }} />
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: "17px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                color: ui.titleColor,
              }}
            >
              EASY SETUP
            </div>
          </div>

          {/* --------------------------- IMAGE CREATION SECTION --------------------- */}
          <div style={cardStyle}>
            <div style={stepLabelRow}>
              <ImageOutlinedIcon style={{ fontSize: "16px", color: ui.accent }} />
              <span>1. IMPORT IMAGE</span>
            </div>
            <div style={dividerStyle} />
            <div style={pathChip}>{imgPath}</div>
            <Box
              sx={{
                width: "100%",
                "& > :not(style)": { m: 0, width: "100%" },
              }}
            >
              <form onSubmit={handleImgUpload}>
                <TextField
                  id="outlined-basic"
                  label="Enter .IMG"
                  value={imgField}
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => handleImgField(e)}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "9px" },
                  }}
                />
              </form>
            </Box>
          </div>

          {/* ------------------- CHOOSE DIRECTORY SECTION ---------------------------- */}
          <Box sx={cardStyle}>
            <div style={stepLabelRow}>
              <FolderOpenOutlinedIcon
                style={{ fontSize: "16px", color: ui.accent }}
              />
              <span>2. CHOOSE DIRECTORY</span>
            </div>
            <div style={dividerStyle} />
            <div style={pathChip}>{shortDir}</div>

            <Button
              variant="contained"
              component="label"
              startIcon={<FolderOpenOutlinedIcon style={{ fontSize: "17px" }} />}
              style={primaryBtn}
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
          <Box sx={cardStyle}>
            <div style={stepLabelRow}>
              <DescriptionOutlinedIcon
                style={{ fontSize: "16px", color: ui.accent }}
              />
              <span>3. CREATE YAML FILE</span>
            </div>
            <div style={dividerStyle} />

            <Button
              onClick={handleYamlOpen}
              startIcon={<DescriptionOutlinedIcon style={{ fontSize: "17px" }} />}
              style={{ ...primaryBtn, marginTop: "6px" }}
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
                  borderRadius: "12px",
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
            borderRadius: "3px",
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
                fontWeight: 700,
                letterSpacing: "1px",
                marginLeft: "40px",
                paddingBottom: "15px",
                whiteSpace: "nowrap",
                color: ui.sectionLabel,
              }}
            >
              INPUT COMMANDS
            </div>
            <EastIcon
              style={{
                marginLeft: "7px",
                height: "30px",
                paddingBottom: "15px",
                color: ui.accent,
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
                      fontWeight: 500,
                      color:
                        isDark && k8tool === "ON"
                          ? "white"
                          : isDark && k8tool === "OFF"
                          ? "#ffffff99"
                          : !isDark && k8tool === "ON"
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
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      color:
                        k8tool === "OFF" && !isDark
                          ? "grey"
                          : k8tool === "ON" && !isDark
                          ? ui.accent
                          : k8tool === "OFF" && isDark
                          ? "#ffffff99"
                          : ui.accent,
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
                  color: ui.accent,
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
                  <Typography id="modal-modal-title"></Typography>
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
                  color: ui.accent,
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
                  <Typography id="modal-modal-title"></Typography>
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
            backgroundColor: ui.learnBg,
            border: ui.learnBorder,
            boxShadow: ui.cardShadow,
            borderRadius: "12px",
            textAlign: "center",
            padding: "8px 0 0 0px",
            margin: "5px 0 0 0px",
            fontFamily: "Outfit",
            fontWeight: "900",
            letterSpacing: "1px",
            alignItems: "flex-start",
            fontSize: "18px",
            overflow: "hidden",
            color: ui.sectionLabel,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderBottom:
                isDark ? ".5px solid #ffffff33" : ".5px solid #ffffff",
              padding: "0 14px 8px 14px",
              width: "100%",
              boxSizing: "border-box",
              height: "33px",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <MenuBookOutlinedIcon
                style={{ fontSize: "20px", color: ui.accent }}
              />
              LEARNING CENTER:
            </div>
            <div
              style={{
                fontSize: "9px",
                fontFamily: "Roboto",
                fontWeight: "400",
                margin: "4px 1.8% 0 0",
                lineHeight: "13px",
                color: ui.chipText,
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
                padding: "4px 10px 4px 15px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: ui.learnRowAlt,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                  color: ui.link,
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
              <div
                style={{
                  marginLeft: "68px",
                  justifyContent: "flex-end",
                  color: ui.star,
                }}
              >
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "4px 10px 4px 15px",
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
                  color: ui.link,
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
              <div
                style={{
                  marginLeft: "80px",
                  justifyContent: "flex-end",
                  color: ui.star,
                }}
              >
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "4px 10px 4px 15px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: ui.learnRowAlt,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                  color: ui.link,
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
              <div
                style={{
                  marginLeft: "100px",
                  justifyContent: "flex-end",
                  color: ui.star,
                }}
              >
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "4px 10px 4px 15px",
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
                  color: ui.link,
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
              <div
                style={{
                  marginLeft: "61px",
                  justifyContent: "flex-end",
                  color: ui.star,
                }}
              >
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarIcon fontSize="small" /> <StarIcon fontSize="small" />{" "}
                <StarOutlineIcon fontSize="small" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "4px 10px 4px 15px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: ui.learnRowAlt,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  height: "18px",
                  letterSpacing: ".5px",
                  color: ui.link,
                }}
              >
                <a href="https://kubernetes.io/docs/tutorials/" target="blank">
                  <strong>MISC. KUBERNETES TUTORIALS (kubernetes.io)</strong> -
                  Learn about Configuration, stateful sets & more
                </a>
              </div>
              <div
                style={{
                  marginLeft: "43px",
                  justifyContent: "flex-end",
                  color: ui.star,
                }}
              >
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
