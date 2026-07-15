import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Typography, useTheme } from "@mui/material";
import { ipcRenderer, clipboard } from "../electron-ipc";
import SideNav from "../components/Sidebar.js";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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

// Electron's <webview> tag (enabled via webviewTag in main.js). Typed as any so
// it can be used as a JSX host element without a custom intrinsic declaration.
const WebView: any = "webview";

function SetupButtons(props) {
  const [promStatus, setPromStatus] = useState("no attempt");
  const [grafStatus, setGrafStatus] = useState("no attempt");
  const [portForwardStatus, setPortForwardStatus] = useState("no attempt");
  const [launchStatus, setLaunchStatus] = useState("no attempt");
  const [log, setLog] = useState("");
  const [grafanaPassword, setGrafanaPassword] = useState("loading...");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  // set to the resolved Grafana dashboard URL once launched; drives the inline
  // <webview> embed (and collapses the setup steps while it's shown).
  const [dashboardUrl, setDashboardUrl] = useState("");
  const webviewRef = useRef<any>(null);
  // whether the webview has fired dom-ready (safe to insertCSS), and the key
  // of the currently inserted stylesheet so a theme toggle can swap it out
  const webviewReadyRef = useRef(false);
  const insertedCssKeyRef = useRef<string | null>(null);

  // true only once we have a real value (not the loading / error placeholders),
  // which gates the reveal/copy controls.
  const hasPassword =
    grafanaPassword !== "loading..." &&
    grafanaPassword !== "COULD NOT RETRIEVE";

  const handleCopyPassword = () => {
    clipboard.writeText(grafanaPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const theme = useTheme();

  useEffect(() => {
    if (props.promGrafCheckStatus === "installed") {
      setPromStatus("true");
      setGrafStatus("true");
    }
  }, []);

  // fetch the live Grafana admin password once on mount. once() + the empty
  // dependency array keeps this a single request with no leaked listener.
  useEffect(() => {
    ipcRenderer.once("get_grafana_password", (event, arg) => {
      setGrafanaPassword(arg);
    });
    ipcRenderer.send("get_grafana_password");
  }, []);

  useEffect(() => {
    //Listen to prom_setup event
    ipcRenderer.on("prom_setup", (event, arg) => {
      setTimeout(() => {
        let returnedValue = arg;
        setLog(log + "prom log:" + returnedValue);
        if (returnedValue.includes("Prom setup complete")) {
          setPromStatus("true");
        } else setPromStatus(returnedValue);
      }, 1000);
    });

    //Listen to graph_setup event
    ipcRenderer.on("graf_setup", (event, arg) => {
      setTimeout(() => {
        let returnedValue = arg;
        setLog(log + " GRAF LOG:" + returnedValue);
        if (returnedValue.includes("Grafana setup complete")) {
          setGrafStatus("true");
        } else setGrafStatus(returnedValue);
      }, 1000);
    });

    // Port-forwarding is now auto-managed by the main process (started on
    // launch, killed/retried if the port is busy). Step 3 just reflects the
    // reported status instead of parsing raw kubectl output.
    ipcRenderer.on("port_forward_status", (event, ok) => {
      setPortForwardStatus(ok ? "true" : "no attempt");
    });

    //Listen to retrieve_key event
    ipcRenderer.on("retrieve_key", (event, arg) => {
      setTimeout(() => {
        setLog(log + " LAUNCH LOG:" + arg);
        // main now returns the resolved dashboard URL on success (or an
        // "Error: ..." string on failure) rather than the literal "true".
        if (typeof arg === "string" && arg.startsWith("http")) {
          setDashboardUrl(arg);
          setLaunchStatus("true");
        } else {
          setLaunchStatus("");
        }
      }, 1000);
    });

    // Remove these listeners before the next re-registration (and on unmount)
    // so they don't accumulate on every render. That leak is what produced the
    // "MaxListenersExceededWarning: 11 retrieve_key listeners" in the terminal.
    return () => {
      ipcRenderer.removeAllListeners("prom_setup");
      ipcRenderer.removeAllListeners("graf_setup");
      ipcRenderer.removeAllListeners("port_forward_status");
      ipcRenderer.removeAllListeners("retrieve_key");
    };
  });

  // On mount, ask the main process whether the auto-started forward is already
  // up, so step 3 shows as done even when the user lands here after launch.
  useEffect(() => {
    ipcRenderer.send("getPortForwardStatus");
  }, []);

  // Once the embedded dashboard loads, tint Grafana's canvas (the area behind
  // the panels) to match the app background instead of Grafana's near-black.
  // We inject CSS into the webview because it's cross-origin content we can't
  // style from our own stylesheet. Panel backgrounds are left alone.
  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv || !dashboardUrl) return;
    const isDark = theme.palette.mode === "dark";
    const canvasBg = isDark ? "#120838" : "#f6f4fe"; // kaptn background
    // panels: 20% darker than the canvas in dark mode (#0e062d, same as the
    // theme's primary[600]); in light mode the app background itself.
    const panelBg = isDark ? "#0e062d" : "#f6f4fe";
    const css = `
      /* canvas behind panels, the header/controls bar, and the footer */
      body, .main-view, .page-dashboard, .dashboard-container, .scrollbar-view,
      .react-grid-layout, .submenu-controls, [class*="submenu"],
      [class*="PageToolbar"], [class*="pageToolbar"], [class*="toolbar"],
      [class*="dashboard-content"], [class*="footer"] {
        background: ${canvasBg} !important;
      }
      /* each panel / pane, tinted from the app background */
      .panel-container, [class*="panel-container"] {
        background: ${panelBg} !important;
      }
      /* header controls + footer: Grafana's emotion class hashes (css-xxxxx)
         change per release, so target the stable data-testid hooks instead,
         and :has() for the unlabeled wrapper around the controls bar */
      div:has(> [data-testid="data-testid dashboard controls"]),
      [data-testid="data-testid dashboard controls"],
      [data-testid="data-testid dashboard controls"] div,
      [data-testid="data-testid dashboard controls"] button,
      [data-testid="public-dashboard-footer"],
      [data-testid="public-dashboard-footer"] * {
        background: ${canvasBg} !important;
      }
      /* the variable pickers (data source, instance, ...) get the panel tint.
         Scoped under the controls container so these win over the canvas rule
         above (2 selectors beats "[controls] div"). */
      [data-testid="data-testid dashboard controls"] [class*="variable"],
      [data-testid="data-testid dashboard controls"] [data-testid*="ariable"],
      [data-testid="data-testid dashboard controls"] [class*="gf-form-input"],
      [data-testid="data-testid dashboard controls"] input,
      [data-testid="data-testid dashboard controls"] [role="combobox"] {
        background: ${panelBg} !important;
      }
    `;
    const applyBackground = async () => {
      // swap out the previously injected sheet so toggles don't stack; a stale
      // key (e.g. after a reload) must never block inserting the new sheet
      try {
        if (insertedCssKeyRef.current && wv.removeInsertedCSS) {
          await wv.removeInsertedCSS(insertedCssKeyRef.current);
        }
      } catch (e) {}
      insertedCssKeyRef.current = null;
      try {
        insertedCssKeyRef.current = await wv.insertCSS(css);
      } catch (e) {
        // webview not ready / navigating — dom-ready will re-apply
      }
    };
    const onDomReady = () => {
      webviewReadyRef.current = true;
      applyBackground();
    };
    // re-apply immediately when the theme toggles while the dashboard is
    // already open (dom-ready has long since fired and won't fire again)
    if (webviewReadyRef.current) {
      applyBackground();
    }
    wv.addEventListener("dom-ready", onDomReady);
    return () => wv.removeEventListener("dom-ready", onDomReady);
  }, [dashboardUrl, theme.palette.mode]);

  const handleClick = () => {
    setPromStatus("loading");
    ipcRenderer.send("prom_setup");
  };

  const handleGrafClick = () => {
    setGrafStatus("loading");
    ipcRenderer.send("graf_setup");
  };

  const handleForwardPort = () => {
    setPortForwardStatus("loading");
    ipcRenderer.send("forward_ports");
  };

  const handleCluster = () => {
    setLaunchStatus("loading");
    ipcRenderer.send("retrieve_key");
  };

  const handleKillPort = () => {
    setPortForwardStatus("loading");
    ipcRenderer.send("kill_port");
    ipcRenderer.send("forward_ports");
  };

  let portForwardDiv;
  if (portForwardStatus === "no attempt") {
    portForwardDiv = (
      <>
        <div>
          {" "}
          <RadioButtonUnchecked
            className="clusterStatusIcons"
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            top: "-34%",
            left: "-.2%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
          }}
        >
          {" "}
          3
        </div>
        <div style={{ marginTop: "-29px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            {" "}
            FORWARD PORTS TO SEE METRICS{" "}
          </Typography>
        </div>
        <br />
        <LightTooltip
          title="Start forwarding to port 3000"
          placement="bottom"
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
          <Button
            onClick={handleForwardPort}
            variant="contained"
            style={{
              border: "1px solid",
              height: "60px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
            }}
          >
            Start port forwarding
          </Button>
        </LightTooltip>
      </>
    );
  } else if (portForwardStatus === "loading") {
    portForwardDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "61.8%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CircularProgress
            className="clusterLoadingIcon"
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
              marginTop: "-48px",
            }}
          />
        </div>
        <div style={{ marginTop: "22.5px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            {" "}
            FORWARD PORTS TO SEE METRICS{" "}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleForwardPort}
          variant="contained"
          disabled
          style={{
            border: "1px solid",
            height: "60px",
            color: "grey",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "transparent",
          }}
        >
          Start port forwarding
        </Button>
      </>
    );
  } else if (portForwardStatus === "true") {
    portForwardDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "61.8%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CheckCircleOutlinedIcon
            className="clusterStatusIcons"
            style={{ color: "#2fc665" }}
          />
        </div>
        <div style={{ marginTop: "70px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#2fc665",
              fontWeight: "500",
            }}
          >
            {" "}
            FORWARD PORTS TO SEE METRICS{" "}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleForwardPort}
          variant="contained"
          disabled
          style={{
            border: "1px solid #2fc665",
            height: "60px",
            color: "#2fc665",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "transparent",
          }}
        >
          Start port forwarding
        </Button>
      </>
    );
  } else {
    portForwardDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "61.8%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <HighlightOffOutlinedIcon
            className="clusterStatusIcons"
            style={{ color: "#cf485b" }}
          />
        </div>

        <div
          id="killport"
          onClick={handleKillPort}
          style={{ color: "#8f85fb", paddingTop: "73px", fontSize: "10.5px" }}
        >
          <u>CLICK HERE TO ATTEMPT TO KILL PORT 3000</u>
        </div>
        <br />
        <Button
          onClick={handleForwardPort}
          variant="contained"
          style={{
            border: "1px solid",
            height: "60px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
          }}
        >
          Start port forwarding
        </Button>
        <div style={{ fontSize: "12px", color: "#cf4848", marginTop: "20px" }}>
          ERROR OCCURRED! PLEASE TRY AGAIN
        </div>
      </>
    );
  }

  let promStatusDiv;
  if (promStatus === "loading") {
    promStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "24.3%",
            left: "14.85%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CircularProgress
            className="clusterLoadingIcon"
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
              marginTop: "-48px",
            }}
          />
        </div>
        <div style={{ marginTop: "22.5px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            SET UP PROMETHEUS IN YOUR CLUSTER
          </Typography>
        </div>

        <br />
        <Button
          onClick={handleClick}
          variant="contained"
          data-disabled="true"
          style={{
            border: "1px solid",
            height: "60px",
            color: "grey",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "transparent",
          }}
        >
          {" "}
          Set up Prometheus{" "}
        </Button>
      </>
    );
  } else if (promStatus === "no attempt") {
    promStatusDiv = (
      <>
        <div>
          {" "}
          <RadioButtonUnchecked
            className="clusterStatusIcons"
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            top: "-34%",
            left: "-1%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
          }}
        >
          {" "}
          1
        </div>
        <div style={{ marginTop: "-29px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            SET UP PROMETHEUS IN YOUR CLUSTER
          </Typography>
        </div>

        <br />
        <LightTooltip
          title="Set up Prometheus and install Helm"
          placement="bottom"
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
          <Button
            onClick={handleClick}
            variant="contained"
            style={{
              border: "1px solid",
              height: "60px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
            }}
          >
            Set up Prometheus
          </Button>
        </LightTooltip>
      </>
    );
  } else if (promStatus === "") {
    <>
      <div
        style={{
          position: "absolute",
          top: "25.3%",
          left: "14.85%",
          marginTop: "0px",
          fontFamily: "Outfit",
          fontSize: "66px",
          fontWeight: "800",
          color: "#353050",
        }}
      >
        {" "}
        1
      </div>
      <div>
        {" "}
        <CheckCircleOutlinedIcon
          className="clusterStatusIcons"
          style={{ color: "#2fc665" }}
        />
      </div>
      <div style={{ marginTop: "70px" }}>
        <Typography
          style={{
            fontSize: "12px",
            color: "#2fc665",
            fontWeight: "500",
          }}
        >
          SET UP PROMETHEUS IN YOUR CLUSTER
        </Typography>
      </div>

      <br />
      <Button
        onClick={handleClick}
        variant="contained"
        style={{
          border: "1px solid #2fc665",
          height: "60px",
          color: "#2fc665",
          backgroundColor:
            theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
        }}
      >
        Set up Prometheus
      </Button>
    </>;
  } else if (promStatus === "true") {
    promStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.3%",
            left: "14.85%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CheckCircleOutlinedIcon
            className="clusterStatusIcons"
            style={{ color: "#2fc665" }}
          />
        </div>
        <div style={{ marginTop: "70px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#2fc665",
              fontWeight: "500",
            }}
          >
            SET UP PROMETHEUS IN YOUR CLUSTER
          </Typography>
        </div>

        <br />
        <Button
          onClick={handleClick}
          variant="contained"
          disabled
          style={{
            border: "1px solid #2fc665",
            height: "60px",
            color: "#2fc665",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "transparent",
          }}
        >
          Set up Prometheus
        </Button>
      </>
    );
  }

  let grafStatusDiv;
  if (grafStatus === "true") {
    grafStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "38.1%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CheckCircleOutlinedIcon
            className="clusterStatusIcons"
            style={{ color: "#2fc665" }}
          />
        </div>
        <div style={{ marginTop: "70px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#2fc665",
              fontWeight: "500",
            }}
          >
            {" "}
            SET UP GRAFANA IN YOUR CLUSTER{" "}
          </Typography>
        </div>
        <br />
        <Button
          variant="contained"
          onClick={handleGrafClick}
          disabled
          style={{
            border: "1px solid #2fc665",
            height: "60px",
            color: "#2fc665",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "transparent",
          }}
        >
          Set up Grafana
        </Button>
      </>
    );
  } else if (grafStatus === "loading") {
    grafStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "38.1%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CircularProgress
            className="clusterLoadingIcon"
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
              marginTop: "-48px",
            }}
          />
        </div>
        <div style={{ marginTop: "22.5px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            {" "}
            SET UP GRAFANA IN YOUR CLUSTER{" "}
          </Typography>
        </div>
        <br />
        <Button
          variant="contained"
          onClick={handleGrafClick}
          disabled
          style={{
            border: "1px solid",
            height: "60px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "transparent",
          }}
        >
          Set up Grafana
        </Button>
      </>
    );
  } else if (grafStatus === "no attempt") {
    grafStatusDiv = (
      <>
        <div>
          {" "}
          <RadioButtonUnchecked
            className="clusterStatusIcons"
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            top: "-34%",
            left: "0%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
          }}
        >
          {" "}
          2
        </div>
        <div style={{ marginTop: "-29px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            {" "}
            SET UP GRAFANA IN YOUR CLUSTER{" "}
          </Typography>
        </div>
        <br />
        <LightTooltip
          title="Install and set up Grafana in your cluster"
          placement="bottom"
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
          <Button
            variant="contained"
            onClick={handleGrafClick}
            style={{
              border: "1px solid",
              height: "60px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
            }}
          >
            Set up Grafana
          </Button>
        </LightTooltip>
      </>
    );
  } else
    grafStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "38.1%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
          2
        </div>
        <div>
          {" "}
          <HighlightOffOutlinedIcon
            className="clusterStatusIcons"
            style={{ color: "#cf485b" }}
          />
        </div>
        <div style={{ marginTop: "70px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#cf485b",
              fontWeight: "500",
            }}
          >
            {" "}
            SET UP GRAFANA IN YOUR CLUSTER{" "}
          </Typography>
        </div>
        <br />
        <Button
          variant="contained"
          onClick={handleGrafClick}
          style={{
            border: "1px solid",
            height: "60px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
          }}
        >
          Set up Grafana
        </Button>
        <div style={{ fontSize: "12px", color: "#cf4848", marginTop: "20px" }}>
          ERROR OCCURRED! PLEASE TRY AGAIN
        </div>
      </>
    );

  let launchStatusDiv;
  if (launchStatus === "no attempt") {
    launchStatusDiv = (
      <>
        <div>
          {" "}
          <RadioButtonUnchecked
            className="clusterStatusIcons"
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            top: "-34%",
            left: "-1%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
          }}
        >
          {" "}
          4
        </div>

        <div style={{ marginTop: "-29px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            {" "}
            OPEN AND VIEW CLUSTER METRICS{" "}
          </Typography>
        </div>
        <br />
        <LightTooltip
          title="Retrieve UID and log in to Cluster Visualizer through your local web browser"
          placement="bottom"
          arrow
          enterDelay={1500}
          leaveDelay={100}
          enterNextDelay={1500}
        >
          <Button
            onClick={handleCluster}
            variant="contained"
            style={{
              border: "1px solid",
              height: "60px",
              paddingRight: "8px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
            }}
          >
            OPEN METRICS VISUALIZER{" "}
            <LaunchIcon fontSize="small" style={{ margin: "0 0 2px 6px" }} />
          </Button>
        </LightTooltip>
      </>
    );
  } else if (launchStatus === "true") {
    launchStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "85%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CheckCircleOutlinedIcon
            className="clusterStatusIcons"
            style={{ color: "#2fc665" }}
          />
        </div>

        <div style={{ marginTop: "70px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#2fc665",
              fontWeight: "500",
            }}
          >
            {" "}
            OPEN AND VIEW CLUSTERS{" "}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleCluster}
          variant="contained"
          style={{
            border: "1px solid #2fc665",
            height: "60px",
            paddingRight: "8px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "#d0ccfc",
            color: "#2fc665",
          }}
        >
          OPEN METRICS VISUALIZER{" "}
          <LaunchIcon fontSize="small" style={{ margin: "0 0 2px 6px" }} />
        </Button>
      </>
    );
  } else if (launchStatus === "loading") {
    launchStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "85%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <CircularProgress
            className="clusterLoadingIcon"
            size={116}
            thickness={4.6}
            style={{
              color: theme.palette.mode === "dark" ? "#353050" : "#8781c9",
              marginTop: "-48px",
            }}
          />
        </div>

        <div style={{ marginTop: "22.5px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#585176",
              fontWeight: "500",
            }}
          >
            {" "}
            OPEN AND VIEW CLUSTERS{" "}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleCluster}
          variant="contained"
          disabled
          style={{
            border: "1px solid",
            height: "60px",
            paddingRight: "8px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "transparent",
          }}
        >
          OPEN METRICS VISUALIZER{" "}
          <LaunchIcon fontSize="small" style={{ margin: "0 0 2px 6px" }} />
        </Button>
      </>
    );
  } else
    launchStatusDiv = (
      <>
        <div
          style={{
            position: "absolute",
            top: "25.2%",
            left: "85%",
            marginTop: "0px",
            fontFamily: "Outfit",
            fontSize: "66px",
            fontWeight: "800",
            color: "#353050",
          }}
        >
          {" "}
        </div>
        <div>
          {" "}
          <HighlightOffOutlinedIcon
            className="clusterStatusIcons"
            style={{ color: "#cf485b" }}
          />
        </div>

        <div style={{ marginTop: "70px" }}>
          <Typography
            style={{
              fontSize: "12px",
              color: "#cf4848",
              fontWeight: "500",
            }}
          >
            {" "}
            OPEN AND VIEW CLUSTERS{" "}
          </Typography>
        </div>
        <br />
        <Button
          onClick={handleCluster}
          variant="contained"
          style={{
            border: "1px solid",
            height: "60px",
            paddingRight: "8px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#150f2d" : "#8881ce",
          }}
        >
          LAUNCH IN BROWSER{" "}
          <LaunchIcon fontSize="small" style={{ margin: "0 0 2px 6px" }} />
        </Button>
        <div style={{ fontSize: "12px", color: "#cf4848", marginTop: "20px" }}>
          ERROR OCCURRED! PLEASE TRY AGAIN
        </div>
      </>
    );
  return (
    <>
      {/* ----------------SIDE BAR---------------- */}
      <SideNav />
      {/* ----------------MAIN CONTENT---------------- */}

      <div
        data-height="100%"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: ".8%",
          marginTop: "5%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "Outfit",
            fontWeight: "800",
            fontSize: "43px",
            justifyContent: "flex-start",
            width: "100%",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "#6466b2",
          }}
        >
          CLUSTER METRICS VISUALIZER
        </div>

        {dashboardUrl && (
          <div
            style={{
              // Symmetric 24px gutters that hold across window sizes: 60px on
              // the left (36px fixed nav + 24px clearance) and 24px on the
              // right. The 0.8% terms cancel the parent div's marginLeft
              // overflow so the frame doesn't drift toward either edge.
              alignSelf: "stretch",
              marginLeft: "calc(60px - 0.8%)",
              marginRight: "calc(0.8% + 24px)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              // no extra gap between the title and the Back button so the
              // space above and below the title reads as equal
              marginTop: "0px",
            }}
          >
            <Button
              onClick={() => setDashboardUrl("")}
              style={{
                marginBottom: "6px",
                paddingTop: "2px",
                paddingBottom: "2px",
                fontSize: "12px",
                color: "#8f85fb",
                textTransform: "none",
              }}
            >
              ← Back to setup
            </Button>
            <WebView
              ref={webviewRef}
              partition="grafana-metrics"
              // theme param keeps Grafana's own text/axis colors in step with
              // the app's mode; changing it reloads the dashboard, and the
              // dom-ready handler re-injects our background CSS for that mode
              src={`${dashboardUrl}&theme=${
                theme.palette.mode === "dark" ? "dark" : "light"
              }`}
              style={{
                width: "100%",
                // Fill most of the viewport, leaving a modest gap below the
                // frame. Subtracts what sits above the frame (parent 5%=5vw top
                // margin + title + button) plus the bottom gap. Raise the 100px
                // to shorten the frame (bigger bottom gap); lower it to grow.
                height: "calc(100vh - 5vw - 100px)",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#120838" : "#f6f4fe",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {!dashboardUrl && (
          <>
        <div
          style={{
            fontWeight: "400",
            fontSize: "14px",
            justifyContent: "flex-start",
            width: "100%",
            letterSpacing: "1px",
            color: theme.palette.mode === "dark" ? "white" : "grey",
          }}
        >
          PLEASE FOLLOW THE STEPS BELOW IN ORDER:
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            margin: "4.8% 1% 0 1%",
          }}
        >
          <div
            style={{
              width: "160%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              margin: "50px 10px 50px 50px",
            }}
          >
            {" "}
            {promStatusDiv}
          </div>

          <div
            style={{
              width: "160%",
              display: "flex",
              flexDirection: "column",
              margin: "50px 10px 50px 10px",
            }}
          >
            {" "}
            {grafStatusDiv}
          </div>

          <div
            style={{
              width: "160%",
              display: "flex",
              flexDirection: "column",
              margin: "50px 10px 50px 10px",
            }}
          >
            {portForwardDiv}
          </div>

          <div
            style={{
              width: "160%",
              display: "flex",
              flexDirection: "column",
              margin: "50px 30px 50px 10px",
            }}
          >
            {launchStatusDiv}
          </div>
          {/* ------------------ HELP HINT TIP SECTION BEGINS--------------------- */}
        </div>
        <div
          style={{
            width: "fit-content",
            minWidth: "450px",
            maxWidth: "640px",
            minHeight: "190px",
            position: "absolute",
            bottom: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "start",
            padding: "17px 10px 10px 20px",
            marginTop: "0px",
            marginLeft: "20px",
            borderRadius: "10px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#2a2152" : "#dedafc",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <LightbulbIcon
              style={{ fontSize: "25px", color: "#8f85fb", marginRight: "8px" }}
            />
            <div
              style={{
                color: "#8f85fb",
                fontSize: "22px",
                fontFamily: "Outfit",
                fontWeight: "800",
                letterSpacing: "2px",
                paddingTop: "0px",
                lineHeight: "5px",
              }}
            >
              HELPFUL TIP!
            </div>
          </div>
          <div
            style={{
              textAlign: "left",
              margin: "14px 0 0 10px",
              fontSize: "15px",
              maxWidth: "410px",
            }}
          >
            If this is your first time visualizing your clusters, use the
            following credentials at the login screen:
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              textAlign: "left",
              alignItems: "center",
              margin: "10px 0 0 10px",
              fontSize: "15px",
            }}
          >
            username:{" "}
            <div
              style={{
                fontFamily: "outfit",
                fontWeight: "600",
                fontSize: "18px",
                marginLeft: "5px",
                color: "#8f85fb",
              }}
            >
              admin
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              textAlign: "left",
              alignItems: "center",
              margin: "10px 0 0 10px",
              fontSize: "15px",
            }}
          >
            password:{" "}
            <div
              style={{
                fontFamily: "outfit",
                fontWeight: "600",
                fontSize: "18px",
                marginLeft: "5px",
                color: "#8f85fb",
                wordBreak: "break-all",
              }}
            >
              {!hasPassword
                ? grafanaPassword
                : showPassword
                ? grafanaPassword
                : "••••••••••"}
            </div>
            {hasPassword && (
              <>
                <IconButton
                  size="small"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Reveal password"}
                  style={{ color: "#8f85fb", marginLeft: "4px" }}
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleCopyPassword}
                  title="Copy password"
                  style={{ color: "#8f85fb" }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                {copied && (
                  <span style={{ fontSize: "13px", color: "#8f85fb" }}>
                    copied!
                  </span>
                )}
              </>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </>
  );
}

export default SetupButtons;
