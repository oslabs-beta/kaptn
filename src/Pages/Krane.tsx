import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useTheme, Box } from "@mui/material";
import { ipcRenderer } from "../electron-ipc";
import { isParseableKubectlTable } from "../lib/parseGuards";
import SideNav from "../components/Sidebar";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import KraneNodeList from "../components/KraneNodeList";
import KranePodList from "../components/KranePodList";
import KraneDeploymentsList from "../components/KraneDeploymentsList";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

//mui custom styled tooltip for info and hint popups
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
    color: "white",
    fontSize: 11,
  },
}));

function Krane(props) {
  // Must be real <MenuItem> elements, never a bare string — the <Select> renders
  // these directly as its children and MUI reads child.props.value on each. Start
  // with just "ALL" so the dropdown is valid before (or without) a namespace load.
  const [namespacesArr, setNamespacesArr] = useState<JSX.Element[]>([
    <MenuItem value="ALL" key={0}>
      ALL
    </MenuItem>,
  ]);

  // null = unknown/checking; false = the namespaces command failed (cluster
  // unreachable) — used to surface the "still not appearing" helper in a view.
  const [clusterReachable, setClusterReachable] = useState<boolean | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState<string>(
    "ALL"
  );

  const [refreshSpeed, setRefreshSpeed] = useState<number>(15);

  const [deploymentsArr, setDeploymentsArr] = useState([]);
  const [podsArr, setPodsArr] = useState([]);
  const [allPodsArr, setAllPodsArr] = useState([]);

  const [nodesArr, setNodesArr] = useState([]);
  const [nodesUsageArr, setNodesUsageArr] = useState([]);
  const [nodesLimitsArr, setNodesLimitsArr] = useState([]);

  const [podsContainersArr, setPodsContainersArr] = useState([]);
  // set by KranePodList when `kubectl top pods` fails with no stats to fall
  // back on (metrics-server starting); read by both lists' pod gauges
  const [podMetricsStartingUp, setPodMetricsStartingUp] = useState(false);
  // true when `kubectl top` fails because metrics-server isn't installed;
  // either list sets it, a successful `kubectl top` clears it
  const [metricsServerMissing, setMetricsServerMissing] = useState(false);
  const [currDir, setCurrDir] = useState<string>("NONE SELECTED");

  const [openPod, setOpenPod] = React.useState<boolean>(false);

  const [openPodLog, setOpenPodLog] = React.useState<boolean>(false);
  const [podLogs, setPodLogs] = React.useState([]);

  const [openPodYaml, setOpenPodYaml] = React.useState<boolean>(false);
  const [podYaml, setPodYaml] = React.useState([]);

  const [openPodDescribe, setOpenPodDescribe] = React.useState<boolean>(false);
  const [podDescribe, setPodDescribe] = React.useState([]);

  const [openPodDelete, setOpenPodDelete] = React.useState<boolean>(false);

  const [selectedPodStatusColor, setSelectedPodStatusColor] = useState<string>("");
  const [selectedPodStatusColorLight, setSelectedPodStatusColorLight] =
    useState<string>("");
  const [selectedPodCPUColor, setSelectedPodCPUColor] = useState<string>("");
  const [selectedPodCPUColorLight, setSelectedPodCPUColorLight] = useState<string>("");
  const [selectedPodMemoryColor, setSelectedPodMemoryColor] = useState<string>("");
  const [selectedPodMemoryColorLight, setSelectedPodMemoryColorLight] =
    useState<string>("");
  const [selectedPod, setSelectedPod] = useState([
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


  const [kraneDeployIPCcount, setKraneDeployIPCCount] = useState(0);

  const theme = useTheme();

  // Docs links opened in an in-app popup window (same lavender as the Start page).
  const openHelp = (url: string) => ipcRenderer.send("open_help_link", url);
  const linkStyle = {
    color: theme.palette.mode === "dark" ? "#b7aefc" : "#4b3fce",
    textDecoration: "underline",
    cursor: "pointer",
  };

  function handleManualStatRefresh(event) {
    //kept below for reference to previous calls
    // setDeploymentsArr([]);
    // setNodesArr([]);
    // setPodsArr([]);
    getPodsAndContainers();
    getNodesInfo();
    getDeploymentsInfo();
  }

  function handleChangeRefreshSpeed(event) {
    props.intervalArray.map((a) => {
      clearInterval(a);
      props.setIntervalArray([]);
    });

    setRefreshSpeed(event.target.value);

    const allInterval = setInterval(() => {
      getPodsAndContainers();
      getNodesInfo();
      getDeploymentsInfo();
    }, event.target.value * 1000);

    props.setIntervalArray([allInterval]);

  }

  const handleChooseKubeConfig = async () => {
    // Native dialog (opens in ~/.kube with hidden files shown) returns the
    // chosen kubeconfig file path, or null if cancelled. main.js applies it as
    // KUBECONFIG and broadcasts "kubeconfig_changed", which re-fetches below.
    const filePath = await ipcRenderer.invoke("choose_kubeconfig");
    if (!filePath) return;
    ipcRenderer.send("set_kubeconfig", filePath);
  };

  const [deploymentsShowStatus, setDeploymentsShowStatus] = useState(false);

  function handleDeploymentsShowStatus() {
    props.intervalArray.map((a) => {
      clearInterval(a);
      props.setIntervalArray([]);
    });

    setNodeShowStatus(false);
    setDeploymentsShowStatus(!deploymentsShowStatus);

    const allInterval = setInterval(() => {
      getPodsAndContainers();
      getNodesInfo();
      getDeploymentsInfo();
    }, refreshSpeed * 1000);

    props.setIntervalArray([allInterval]);
  }

  function getDeploymentsInfo() {
    setDeploymentsArr([])
    let deploymentsCommand: string =
      "kubectl get deployments -o wide --all-namespaces";
    //send krane command to get all nodes
    ipcRenderer.send("getDeployments_command", {
      deploymentsCommand,
      currDir,
    });

    let getReplicasCommand: string = `kubectl get rs -o wide --all-namespaces`;
    setTimeout(() => {
      ipcRenderer.send("getReplicas_command", {
        getReplicasCommand,
        currDir,
      });
    }, 5);
  }

  const [nodeShowStatus, setNodeShowStatus] = useState(false);

  function handleNodeShowStatus() {
    props.intervalArray.map((a) => {
      clearInterval(a);
      props.setIntervalArray([]);
    });

    setDeploymentsShowStatus(false);
    setNodeShowStatus(!nodeShowStatus);

    const allInterval = setInterval(() => {
      getPodsAndContainers();
      getNodesInfo();
      getDeploymentsInfo();
    }, refreshSpeed * 1000);

    props.setIntervalArray([allInterval]);

  }

  function getPodsAndContainers() {
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
    }, 250);

    // ----------------------------------------------- Beginning of get pod cpu and memory limits section

    let cpuLimitsCommand = `kubectl get po --all-namespaces -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu",Memory-limit:"spec.containers[*].resources.limits.memory"`;
    setTimeout(() => {
      ipcRenderer.send("getCpuLimits_command", {
        cpuLimitsCommand,
        currDir,
      });
    }, 400);

    // send command to get selected pods containers info
    let podContainersCommand = `kubectl top pod --containers --all-namespaces`;
    //send get pods o wide info commands
    setTimeout(() => {
      ipcRenderer.send("podContainers_command", {
        podContainersCommand,
        currDir,
      });
    }, 450);
  }

  function getNodesInfo() {
    let kraneCommand: string = "kubectl get nodes -o wide";
    //send krane command to get all nodes
    ipcRenderer.send("getNodes_command", {
      kraneCommand,
      currDir,
    });

    //---------------------------------------- get all nodes cpu and memory usage -
    let nodesCpuUsedCommand: string = `kubectl top nodes`;
    setTimeout(() => {
      ipcRenderer.send("getNodesCpuUsed_command", {
        nodesCpuUsedCommand,
        currDir,
      });
    }, 550);

    let nodesCpuLimitsCommand: string = `kubectl get nodes -o custom-columns="Name:metadata.name,CPU-limit:spec.containers[*].resources.limits.cpu,Memory-limit:spec.containers[*].resources.limits.cpu"`;
    setTimeout(() => {
      ipcRenderer.send("getNodesCpuLimits_command", {
        nodesCpuLimitsCommand,
        currDir,
      });
    }, 570);
  }

  function getNamespaces() {
    let namespacesCommand: string = "kubectl get ns";
    //send krane command to get all nodes
    ipcRenderer.send("getNamespaces_command", {
      namespacesCommand,
      currDir,
    });
  }

  // Re-fetch when the kubeconfig changes (from the top bar or the picker below)
  // so a chosen config takes effect immediately. Named handler + removeListener
  // so we don't clobber the Topbar's listener on the same channel.
  useEffect(() => {
    const onKubeChange = () => {
      getNamespaces();
      getNodesInfo();
      getDeploymentsInfo();
    };
    ipcRenderer.on("kubeconfig_changed", onKubeChange);
    return () => ipcRenderer.removeListener("kubeconfig_changed", onKubeChange);
  }, []);

  useEffect(() => {
    ipcRenderer.on("got_namespaces", (event, arg) => {
      // This event only fires when the command succeeded, so the cluster is up.
      setClusterReachable(true);
      // Skip parsing when there's no namespace table (empty or error output),
      // so the dropdown stays a clean "ALL" instead of garbage entries.
      if (!isParseableKubectlTable(arg)) return;

      let argArr = arg.split("");

      let namespaceArrayOutput : string[] = [];

      let i: number = 0;

      //skip row of column titles
      while (i < arg.length && arg[i] !== "\n") {
        i++;
      }
      i++;

      for (let j = 0; i < argArr.length; i++) {
        let namespaceOutput: string[] = [];

        //saves namespace
        while (i < arg.length && arg[i] !== " ") {
          namespaceOutput.push(arg[i]);
          i++;
        }
        let output = namespaceOutput.join("");
        let prevNamespaces = [...namespacesArr];
        namespaceArrayOutput.push(output);
        //skips spaces
        while (i < arg.length && arg[i] !== "\n") {
          i++;
        }
      }

      //for each namespace, create an array with MenuItems JSX for mui select component, starting with an "ALL" option first.
      let finalOutput : JSX.Element[] = [];
      finalOutput.push(
        <MenuItem
          value={"ALL"}
          key={0}
          style={{
            color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
            backgroundColor:
              theme.palette.mode === "dark" ? "#5c4d9a" : "white",
            fontSize: "12px",
          }}
          sx={{ bg: theme.palette.mode === "dark" ? "#5c4d9a" : "white" }}
        >
          ALL
        </MenuItem>
      );

      for (let k = 0; k < namespaceArrayOutput.length; k++) {
        finalOutput.push(
          <MenuItem
            value={`${namespaceArrayOutput[k]}`}
            key={k + 1}
            style={{
              color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
              backgroundColor:
                theme.palette.mode === "dark" ? "#5c4d9a" : "white",
              fontSize: "12px",
            }}
            sx={{ bg: theme.palette.mode === "dark" ? "#5c4d9a" : "white" }}
          >
            {namespaceArrayOutput[k]}
          </MenuItem>
        );
      }

      setNamespacesArr(finalOutput);
    });

    // A down cluster sends this instead of got_namespaces — mark it unreachable
    // so a chosen view can surface the "still not appearing" helper.
    ipcRenderer.on("got_namespaces_status", () => {
      setClusterReachable(false);
    });

    getNamespaces();

    props.intervalArray.map((a) => {
      clearInterval(a);
      props.setIntervalArray([]);
    });

    //remove the namespaces listener on unmount so it doesn't leak a new
    //listener each time the Krane page is navigated to and back.
    return () => {
      ipcRenderer.removeAllListeners("got_namespaces");
      ipcRenderer.removeAllListeners("got_namespaces_status");
    };
  }, []);

  function handleNamespaceChange(event) {
    setSelectedNamespace(event.target.value);
    handleManualStatRefresh(null);
  }

  // Helper shown when clusters don't appear — offers loading a custom kubeconfig.
  // Reused on the landing screen and beneath a chosen view when unreachable.
  // Shown in place of a chosen view when the cluster is unreachable.
  const unreachablePanel = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        margin: "11% 0 0 0",
        gap: "6px",
        textTransform: "uppercase",
      }}
    >
      <div
        style={{
          fontFamily: "Outfit",
          fontSize: "34px",
          fontWeight: "900",
          letterSpacing: "0.5px",
          color: theme.palette.mode === "dark" ? "#ffffff" : "#3c3c9a",
        }}
      >
        Cluster not found
      </div>
      <div
        style={{
          fontFamily: "Outfit",
          fontSize: "22px",
          fontWeight: "500",
          letterSpacing: "0.5px",
          color: theme.palette.mode === "dark" ? "#ffffff" : "#3c3c9a",
        }}
      >
        Is{" "}
        <span
          onClick={() => openHelp("https://docs.docker.com/get-started/")}
          style={linkStyle}
        >
          Docker
        </span>{" "}
        or{" "}
        <span
          onClick={() => openHelp("https://minikube.sigs.k8s.io/docs/start/")}
          style={linkStyle}
        >
          minikube
        </span>{" "}
        running?
      </div>
      <div
        style={{
          fontFamily: "Outfit",
          fontSize: "13px",
          fontWeight: "600",
          letterSpacing: "0.6px",
          marginTop: "6px",
          color: theme.palette.mode === "dark" ? "#ffffffaa" : "#3c3c9a",
        }}
      >
        Or{" "}
        <span onClick={handleChooseKubeConfig} style={linkStyle}>
          click here
        </span>{" "}
        to choose a custom .kube/config file
      </div>
    </div>
  );

  // ---------------------------------------------------------- START OF IF CONDITION TO DETERMINE MAIN DIV'S JSX --------
  let deploymentsDiv : JSX.Element;
  if (deploymentsShowStatus) {
    deploymentsDiv = (
      <>
        <KraneDeploymentsList
          selectedNamespace={selectedNamespace}
          getDeploymentsInfo={getDeploymentsInfo}
          deploymentsArr={deploymentsArr}
          setDeploymentsArr={setDeploymentsArr}
          podsStatsObj={props.podsStatsObj}
          setPodsStatsObj={props.setPodsStatsObj}
          nodesStatsObj={props.nodesStatsObj}
          setNodesStatsObj={props.setNodesStatsObj}
          kraneDeployIPCcount={kraneDeployIPCcount}
          setKraneDeployIPCCount={setKraneDeployIPCCount}
        />
      </>
    );
  }

  let nodesAndPodsDiv: JSX.Element;
  if (nodeShowStatus) {
    nodesAndPodsDiv = (
      <>
        <KraneNodeList
          podMetricsStartingUp={podMetricsStartingUp}
          metricsServerMissing={metricsServerMissing}
          setMetricsServerMissing={setMetricsServerMissing}
          nodesArr={nodesArr}
          setNodesArr={setNodesArr}
          nodesUsageArr={nodesUsageArr}
          setNodesUsageArr={setNodesUsageArr}
          nodesLimitsArr={nodesLimitsArr}
          setNodesLimitsArr={setNodesLimitsArr}
          podsArr={podsArr}
          setPodsArr={setPodsArr}
          allPodsArr={allPodsArr}
          setAllPodsArr={setAllPodsArr}
          podsContainersArr={podsContainersArr}
          setPodsContainersArr={setPodsContainersArr}
          getNodesInfo={getNodesInfo}
          openPod={openPod}
          setOpenPod={setOpenPod}
          openPodDelete={openPodDelete}
          setOpenPodDelete={setOpenPodDelete}
          openPodLog={openPodLog}
          setOpenPodLog={setOpenPodLog}
          podLogs={podLogs}
          setPodLogs={setPodLogs}
          openPodYaml={openPodYaml}
          setOpenPodYaml={setOpenPodYaml}
          podYaml={podYaml}
          setPodYaml={setPodYaml}
          openPodDescribe={openPodDescribe}
          setOpenPodDescribe={setOpenPodDescribe}
          podDescribe={podDescribe}
          setPodDescribe={setPodDescribe}
          selectedPodStatusColor={selectedPodStatusColor}
          setSelectedPodStatusColor={setSelectedPodStatusColor}
          selectedPodCPUColor={selectedPodCPUColor}
          setSelectedPodCPUColor={setSelectedPodCPUColor}
          selectedPodMemoryColor={selectedPodMemoryColor}
          setSelectedPodMemoryColor={setSelectedPodMemoryColor}
          selectedPodStatusColorLight={selectedPodStatusColorLight}
          setSelectedPodStatusColorLight={setSelectedPodStatusColorLight}
          selectedPodCPUColorLight={selectedPodCPUColorLight}
          setSelectedPodCPUColorLight={setSelectedPodCPUColorLight}
          selectedPodMemoryColorLight={selectedPodMemoryColorLight}
          setSelectedPodMemoryColorLight={setSelectedPodMemoryColorLight}
          selectedPod={selectedPod}
          setSelectedPod={setSelectedPod}
          podsStatsObj={props.podsStatsObj}
          setPodsStatsObj={props.setPodsStatsObj}
          nodesStatsObj={props.nodesStatsObj}
          setNodesStatsObj={props.setNodesStatsObj}
          kraneDeployIPCcount={kraneDeployIPCcount}
          setKraneDeployIPCCount={setKraneDeployIPCCount}
        />
        <KranePodList
          podMetricsStartingUp={podMetricsStartingUp}
          setPodMetricsStartingUp={setPodMetricsStartingUp}
          metricsServerMissing={metricsServerMissing}
          setMetricsServerMissing={setMetricsServerMissing}
          selectedNamespace={selectedNamespace}
          podsArr={podsArr}
          setPodsArr={setPodsArr}
          allPodsArr={allPodsArr}
          setAllPodsArr={setAllPodsArr}
          getPodsAndContainers={getPodsAndContainers}
          currDir={currDir}
          setCurrDir={setCurrDir}
          podsContainersArr={podsContainersArr}
          setPodsContainersArr={setPodsContainersArr}
          openPod={openPod}
          setOpenPod={setOpenPod}
          openPodDelete={openPodDelete}
          setOpenPodDelete={setOpenPodDelete}
          openPodLog={openPodLog}
          setOpenPodLog={setOpenPodLog}
          podLogs={podLogs}
          setPodLogs={setPodLogs}
          openPodYaml={openPodYaml}
          setOpenPodYaml={setOpenPodYaml}
          podYaml={podYaml}
          setPodYaml={setPodYaml}
          openPodDescribe={openPodDescribe}
          setOpenPodDescribe={setOpenPodDescribe}
          podDescribe={podDescribe}
          setPodDescribe={setPodDescribe}
          selectedPodStatusColor={selectedPodStatusColor}
          setSelectedPodStatusColor={setSelectedPodStatusColor}
          selectedPodCPUColor={selectedPodCPUColor}
          setSelectedPodCPUColor={setSelectedPodCPUColor}
          selectedPodMemoryColor={selectedPodMemoryColor}
          setSelectedPodMemoryColor={setSelectedPodMemoryColor}
          selectedPodStatusColorLight={selectedPodStatusColorLight}
          setSelectedPodStatusColorLight={setSelectedPodStatusColorLight}
          selectedPodCPUColorLight={selectedPodCPUColorLight}
          setSelectedPodCPUColorLight={setSelectedPodCPUColorLight}
          selectedPodMemoryColorLight={selectedPodMemoryColorLight}
          setSelectedPodMemoryColorLight={setSelectedPodMemoryColorLight}
          selectedPod={selectedPod}
          setSelectedPod={setSelectedPod}
          podsStatsObj={props.podsStatsObj}
          setPodsStatsObj={props.setPodsStatsObj}
          nodesStatsObj={props.nodesStatsObj}
          setNodesStatsObj={props.setNodesStatsObj}
          kraneDeployIPCcount={kraneDeployIPCcount}
          setKraneDeployIPCCount={setKraneDeployIPCCount}
        />
      </>
    );
  }

  let refreshShowDiv: JSX.Element;
  let noneChosenDiv: JSX.Element;
  if (nodeShowStatus || deploymentsShowStatus) {
    refreshShowDiv = (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "91%",
            height: "30px",
            fontSize: "9px",
            fontWeight: "400",
            letterSpacing: "1px",
            lineHeight: "12px",
            paddingBottom: "0px",
            textAlign: "right",
            color: theme.palette.mode === "dark" ? "#ffffff99" : "#00000090",
            marginRight: "0px",
            marginTop: "10px",
            marginBottom: "-16px",
            justifyContent: "flex-end",
            textTransform: "uppercase",
          }}
        >
          {" "}
          Stats refresh every
          <Box
            style={{
              marginLeft: "10px",
              marginTop: "-5px",
              marginBottom: "0px",
              letterSpacing: ".8px",
              border: theme.palette.mode === "dark" ? "1px solid" : "",
              fontSize: "4px",
              width: "115px",
              height: "20px",
            }}
          >
            <FormControl
              style={{
                display: "flex",
                width: "115px",
                height: "20px",
                padding: "0 0 0 0",
                margin: "0 0 0 0",
                fontSize: "4px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  width: "115px",
                  height: "20px",
                  padding: "0 0 0 0",
                  margin: "0 0 0 0",
                  fontSize: "4px",
                }}
              ></InputLabel>
              <Select
                defaultValue={15}
                onChange={handleChangeRefreshSpeed}
                style={{
                  display: "flex",
                  width: "115px",
                  height: "20px",
                  padding: "0 0 0 0",
                  margin: "0 0 0 0",
                  fontSize: "9px",
                }}
              >
                <MenuItem
                  value={15}
                  key={0}
                  style={{
                    color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
                  }}
                >
                  15 seconds
                </MenuItem>
                <MenuItem
                  key={2}
                  value={30}
                  style={{
                    color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
                  }}
                >
                  30 seconds
                </MenuItem>
                <MenuItem
                  value={60}
                  key={3}
                  style={{
                    color: theme.palette.mode === "dark" ? "#ffffff" : "grey",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#5c4d9a" : "white",
                    fontSize: "12px",
                  }}
                >
                  60 seconds
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
         
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "91%",
            height: "30px",
            fontSize: "9px",
            fontWeight: "400",
            letterSpacing: "1px",
            lineHeight: "12px",
            paddingBottom: "0px",
            paddingTop: "5px",
            textAlign: "right",
            color: theme.palette.mode === "dark" ? "#ffffff99" : "grey",
            marginRight: "0px",
            marginTop: "18px",
            justifyContent: "flex-end",
            marginBottom: "-29px",
          }}
        >
          {" "}
          NAMESPACE:
          <LightTooltip
            title="View resources from a specific namespace. These options are populated using the 'kubectl get namespaces' command. Please note: Some namespaces may not have visible pods or deployments."
            placement="top"
            arrow
            enterDelay={1800}
            leaveDelay={100}
            enterNextDelay={3000}
          >
            <Box
              style={{
                marginLeft: "10px",
                marginTop: "-5px",
                marginBottom: "0px",
                letterSpacing: ".8px",
                border: theme.palette.mode === "dark" ? "1px solid" : "",
                fontSize: "4px",
                height: "20px",
                textTransform: "uppercase",
              }}
            >
              <FormControl
                style={{
                  display: "flex",
                  height: "20px",
                  padding: "0 0 0 0",
                  margin: "0 0 0 0",
                  fontSize: "4px",
                }}
              >
                <InputLabel
                  style={{
                    display: "flex",
                    height: "20px",
                    padding: "0 0 0 0",
                    margin: "0 0 0 0",
                    fontSize: "4px",
                  }}
                ></InputLabel>
                <Select
                  defaultValue={"ALL"}
                  onChange={handleNamespaceChange}
                  style={{
                    display: "flex",
                    height: "20px",
                    padding: "0 0 0 0",
                    margin: "0 0 0 0",
                    fontSize: "9px",
                    textTransform: "uppercase",
                  }}
                >
                  {namespacesArr}
                </Select>
              </FormControl>
            </Box>
           
          </LightTooltip>
        </div>
      </>
    );
  } else {
    noneChosenDiv = (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: "Outfit",
            margin: "20% 0 0 0",
            fontSize: "28px",
            fontWeight: "900",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: theme.palette.mode === "dark" ? "" : "#00000070",
          }}
        >
          Choose From Above to Begin
        </div>
      </>
    );
  }

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
            marginTop: "35px",
            marginBottom: "20px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: "Outfit",
              fontWeight: "800",
              fontSize: "58px",
              justifyContent: "flex-start",
              userSelect: "none",
              overflowY: "hidden",
              alignItems: "center",
              width: "100%",
              letterSpacing: "0px",
              color: theme.palette.mode === "dark" ? "white" : "#6466b2",
              textShadow:
                theme.palette.mode === "dark" ? "5px 5px 2px #00000060" : "",
            }}
          >
            kaptn krane
          </div>
          <div
            style={{
              fontWeight: "400",
              fontSize: "14.5px",
              alignItems: "center",
              justifyContent: "flex-start",
              userSelect: "none",
              marginBottom: "10px",
              width: "100%",
              letterSpacing: "-.1px",
              color: theme.palette.mode === "dark" ? "white" : "grey",
              textShadow:
                theme.palette.mode === "dark" ? "2px 2px 2px #00000040" : "",
            }}
          >
            Easily manage your clusters, nodes, and containers.
            <br />
            <p></p>
          </div>
          <div style={{ display: "flex", margin: "-5px 0 0 0" }}>
            <Button
              onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark" && !nodeShowStatus
                    ? "1px solid #ffffff"
                    : theme.palette.mode !== "dark" && !nodeShowStatus
                    ? "1px solid #00000060"
                    : "1px solid #8d85f3",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" && !nodeShowStatus
                    ? "#ffffff"
                    : theme.palette.mode !== "dark" && !nodeShowStatus
                    ? "#00000060"
                    : "white",
                backgroundColor: !nodeShowStatus ? "transparent" : "#8d85f3",
              }}
            >
              NODES & PODS
            </Button>
            <Button
              onClick={handleDeploymentsShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark" && !deploymentsShowStatus
                    ? "1px solid #ffffff"
                    : theme.palette.mode !== "dark" && !deploymentsShowStatus
                    ? "1px solid #00000060"
                    : "1px solid #8d85f3",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" && !deploymentsShowStatus
                    ? "#ffffff"
                    : theme.palette.mode !== "dark" && !deploymentsShowStatus
                    ? "#00000060"
                    : "white",
                backgroundColor: !deploymentsShowStatus
                  ? "transparent"
                  : "#8d85f3",
              }}
            >
              DEPLOYMENTS
            </Button>

            <Button
              // onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid #ffffff80"
                    : "1px solid #00000060",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              }}
            >
              DAEMONSETS
            </Button>
            <Button
              // onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid #ffffff80"
                    : "1px solid #00000060",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              }}
            >
              SERVICES
            </Button>
            <Button
              // onClick={handleNodeShowStatus}
              style={{
                marginLeft: "10px",
                marginTop: "8px",
                letterSpacing: ".8px",
                padding: "12px 10px 12px 10px",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid #ffffff80"
                    : "1px solid #00000060",
                fontSize: "12px",
                height: "20px",
                color:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              }}
            >
              NAMESPACES
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              margin: "5px 0 0 260px",
              color: theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
              fontSize: "9px",
              letterSpacing: ".5px",
            }}
          >
            <div
              style={{
                height: "1px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
                width: "100px",
                margin: "6px 0px 0 0px",
              }}
            ></div>
            <div style={{ margin: "0 5px 0 5px" }}>COMING SOON!</div>
            <div
              style={{
                height: "1px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#ffffff80" : "#00000060",
                width: "100px",
                margin: "6px 0px 0 0px",
              }}
            ></div>
          </div>

          {refreshShowDiv}
          {(nodeShowStatus || deploymentsShowStatus) &&
          clusterReachable === false ? (
            unreachablePanel
          ) : (
            <div style={{ marginTop: "-18px", width: "100%" }}>
              {nodesAndPodsDiv}
              {deploymentsDiv}
            </div>
          )}
        </div>
        {noneChosenDiv}
      </div>
    </>
  );
}

export default Krane;
