import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material";
const { ipcRenderer } = require("electron");
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import LinearProgress from "@mui/material/LinearProgress";

function Start(props) {
  //for light/dark mode toggle
  const theme = useTheme();

  // CHECK KUBECTL VERSION SECTION
  const [kubectlCheckStatus, setKubectlCheckStatus] = useState("checking");
  const [kubectlClientVersion, setKubectlClientVersion] = useState("");
  const [kubectlServerVersion, setKubectlServerVersion] = useState("");

  const [metricsCheckStatus, setMetricsCheckStatus] = useState("checking");
  // const [metricsVersion, setMetricsVersion] = useState("");

  let argOut = "";

  // command for check if metrics server installed is: kubectl get pods --all-namespaces | grep metrics-server
  // if result is empty string, nothing installed, else it is installed.
  let kubectlCheckMetricsInstallCommand =
    "kubectl get pods --all-namespaces | grep metrics-server";

  ipcRenderer.on("checked_promgraf_installed", (event, arg) => {
    console.log(arg.includes("grafana"));

    if (arg.includes("grafana") && arg.includes("prometheus")) {
      props.setGrafVersion("installed");
      props.setPromVersion("installed");
      setTimeout(() => {
        props.setPromGrafCheckStatus("installed");
      }, 2400);
    } else {
      setTimeout(() => {
        props.setPromGrafCheckStatus("not_installed");
      }, 2400);
    }
  });

  ipcRenderer.on("checked_metrics_installed", (event, arg) => {
    if (!arg.length) {
      //metrics not installed, save metrics status as not installed
      setTimeout(() => {
        setMetricsCheckStatus("not_installed");
      }, 1500);
    } else {
      setTimeout(() => {
        setMetricsCheckStatus("installed");
      }, 1500);
    }
  });

  ipcRenderer.on("checked_kubectl_installed", (event, arg) => {
    argOut = JSON.parse(arg);
    let kubectlClientVersionArr = [];
    let kubectlServerVersionArr = [];
    //@ts-expect-error
    if (argOut.clientVersion.gitVersion) {
      //@ts-expect-error
      let temp = argOut.clientVersion.gitVersion.slice(1, -2);
      setKubectlClientVersion(temp);
      //@ts-expect-error
      temp = argOut.serverVersion.gitVersion.slice(1, -2);
      setKubectlServerVersion(temp);

      setTimeout(() => {
        setKubectlCheckStatus("Installed");
      }, 800);
    } else if (arg[0] === "W") {
      //if first letter is "W" you are getting version warning, so this parses version warning output
      let i = 44;
      while (arg[i] !== ")") {
        kubectlClientVersionArr.push(arg[i]);
        i++;
      }
      i += 14;
      while (arg[i] !== ")") {
        kubectlServerVersionArr.push(arg[i]);
        i++;
      }
      setKubectlClientVersion(`${kubectlClientVersionArr.join("")}`);

      setKubectlServerVersion(`${kubectlServerVersionArr.join("")}`);

      setTimeout(() => {
        setKubectlCheckStatus("Installed");
      }, 800);
    }
    //need to parse json object below this line and save client and server versions for when you dont have version +-1 sync warning (like i currently do).
    else if (arg[0] === "e" && arg[1] === "r" && arg[2] === "r") {
      setTimeout(() => {
        setKubectlCheckStatus("not_installed");
      }, 800);
    } else {
      setTimeout(() => {
        setKubectlCheckStatus("CannotDetect");
      }, 800);
    }
  });

  let kubectlCheckKubectlInstallCommand = "kubectl version --output=json";
  let kubectlCheckPromGrafInstallCommand = "kubectl get services -o wide";

  let currDir = "NONE SELECTED";
  useEffect(() => {
    // send check if kubectl commands installed
    ipcRenderer.send("check_kubectl_installed", {
      kubectlCheckKubectlInstallCommand,
      currDir,
    });

    // send check metrics installed command
    ipcRenderer.send("check_metrics_installed", {
      kubectlCheckMetricsInstallCommand,
      currDir,
    });

    if (props.promGrafCheckStatus !== "installed") {
      // send check prom anf graf installed command
      ipcRenderer.send("check_promgraf_installed", {
        kubectlCheckPromGrafInstallCommand,
        currDir,
      });
    }
  }, []);

  //set the kubectl install div based on its check status
  let kubectlInstalledDiv;
  if (kubectlCheckStatus === "Installed") {
    kubectlInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        kubectl client v{kubectlClientVersion} and server v
        {kubectlServerVersion} found
        <CheckIcon
          fontSize="small"
          style={{ margin: "-1px 0 0 5px", color: "lightgreen" }}
        />
      </div>
    );
  } else if (kubectlCheckStatus === "InstalledUncertain") {
    kubectlInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        kubectl commands found
        <CheckIcon
          fontSize="small"
          style={{ margin: "-1px 0 0 5px", color: "lightgreen" }}
        />
      </div>
    );
  } else if (kubectlCheckStatus === "checking") {
    kubectlInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
        }}
      >
        ... checking if kubectl commands are installed ...
      </div>
    );
  } else if (kubectlCheckStatus === "not_installed") {
    kubectlInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
        }}
      >
        kubectl commands not found. Please install using the link to the right.
      </div>
    );
  } else if (kubectlCheckStatus === "CannotDetect") {
    kubectlInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
        }}
      >
        Warning: If you not installed kubectl, please use the link to the right.
      </div>
    );
  }

  let metricsInstalledDiv;
  if (metricsCheckStatus === "installed") {
    metricsInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        metrics server found{" "}
        <CheckIcon
          fontSize="small"
          style={{ margin: "-1px 0 0 5px", color: "lightgreen" }}
        />
      </div>
    );
  } else if (metricsCheckStatus === "not_installed") {
    metricsInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        Metrics server not installed. Kluster Manager requires metrics.{" "}
        <div
          id="metrics_install_link"
          onClick={handleInstallMetrics}
          style={{ marginLeft: "2px", color: "lightgreen" }}
        >
          Install metrics server now
        </div>
      </div>
    );
  } else if (metricsCheckStatus === "now_installed") {
    metricsInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        metrics server install attempted. if problems persist, visit{" "}
        <a
          href="https://github.com/kubernetes-sigs/metrics-server"
          target="blank"
          style={{ margin: "0px 0 0 3px", color: "lightgreen" }}
        >
          this link
        </a>
        <CheckIcon
          fontSize="small"
          style={{ margin: "-1px 0 0 5px", color: "lightgreen" }}
        />
      </div>
    );
  } else if (metricsCheckStatus === "checking") {
    metricsInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        ... checking if metrics server is installed ...
      </div>
    );
  }

  let promGrafInstallDiv;
  if (props.promGrafCheckStatus === "not_installed") {
    promGrafInstallDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        prometheus and grafana not found. Install on the Metrics Visualizer
        page.
      </div>
    );
  } else if (props.promGrafCheckStatus === "installed") {
    promGrafInstallDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        grafana and prometheus found{" "}
        <CheckIcon
          fontSize="small"
          style={{ margin: "-1px 0 0 5px", color: "lightgreen" }}
        />
      </div>
    );
  } else if (props.promGrafCheckStatus === "checking") {
    promGrafInstallDiv = (
      <div
        style={{
          fontSize: "11px",
          display: "flex",
          flexDirection: "row",
          color: theme.palette.mode === "dark" ? "" : "#3c3c9a",
          userSelect: "none",
        }}
      >
        ... checking if prometheus and grafana are installed ...
      </div>
    );
  }

  let loadingStatusDiv;
  if (
    props.promGrafCheckStatus !== "checking" &&
    kubectlCheckStatus !== "checking" &&
    metricsCheckStatus !== "checking"
  ) {
    loadingStatusDiv = (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "55px",
          height: "20px",
          margin: "0px 0px 10px 0",
        }}
      >
        {" "}
        <div
          style={{
            height: "2px",
            width: "55px",
          }}
        ></div>
        {}
      </Box>
    );
  } else {
    loadingStatusDiv = (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "55px",
          height: "20px",
          margin: "0px 0px 10px 0",
        }}
      >
        <LinearProgress
          color="primary"
          value={10}
          style={{ height: "2px", width: "55px" }}
        />
        {}
      </Box>
    );
  }

  // END OF CHECK KUBECTL INSTALLED SECTION

  ipcRenderer.on("installed_metrics", (event, arg) => {
    argOut = arg;
    setMetricsCheckStatus("now_installed");
  });

  function handleInstallMetrics() {
    let kubectlMetricsServerInstallCommand =
      "kubectl apply -f https://raw.githubusercontent.com/pythianarora/total-practice/master/sample-kubernetes-code/metrics-server.yaml";

    let currDir = "NONE SELECTED";

    ipcRenderer.send("install_metrics_server_command", {
      kubectlMetricsServerInstallCommand,
      currDir,
    });
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "auto",
          height: "768px",
          margin: "12px 0 0 0",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            height: "522px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              height: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box
              src="./kaptn4ico.png"
              sx={{
                margin: "80px 0 10px 0",
                height: "270px",
                width: "270px",
                justifyContent: "center",
                alignItems: "center",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
              component="img"
              width="50%"
            ></Box>

            {loadingStatusDiv}

            {kubectlInstalledDiv}

            {metricsInstalledDiv}

            {promGrafInstallDiv}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: "50%",
              height: "100%",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Outfit",
                  fontSize: "82px",
                }}
                style={{
                  color: theme.palette.mode === "dark" ? "white" : "#3c3c9a",
                  textShadow:
                    theme.palette.mode === "dark"
                      ? "1px 1px 5px rgb(0, 0, 0, 0.3)"
                      : "1px 1px 5px rgb(0, 0, 0, 0.0)",
                }}
              >
                kaptn
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Outfit",
                  fontSize: "45px",
                  margin: "35.5px 0 0 15px",
                }}
                style={{
                  color: theme.palette.mode === "dark" ? "magenta" : "#3c3c9a",
                  textShadow:
                    theme.palette.mode === "dark"
                      ? "1px 1px 5px rgb(0, 0, 0, 0.3)"
                      : "1px 1px 5px rgb(0, 0, 0, 0.0)",
                }}
              >
                v2.0
              </Typography>
            </div>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontFamily: "Outfit",
                fontWeight: 300,
                fontSize: "32px",
                letterSpacing: ".05px",
                color: theme.palette.mode === "dark" ? "#f5f5f5" : "#3c3c9a",
                textDecoration: "none",
                mt: 2,
                mb: 8,
                mr: 3,
                ml: 3,
                zIndex: "130",
                textShadow:
                  theme.palette.mode === "dark"
                    ? "1px 1px 5px rgb(0, 0, 0, 0.3)"
                    : "",
                userSelect: "none",
              }}
            >
              {" "}
              take command of kubernetes
            </Typography>
            <br />
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontFamily: "Roboto",
                fontWeight: 300,
                fontSize: "15px",
                letterSpacing: ".05px",
                color: theme.palette.mode === "dark" ? "#f5f5f5" : "#3c3c9a",
                textDecoration: "none",
                mt: 3,
                mb: 0,
                mr: 3,
                ml: 3,
                zIndex: "130",
                textShadow:
                  theme.palette.mode === "dark"
                    ? "1px 1px 5px rgb(0, 0, 0, 0.3)"
                    : "",
                userSelect: "none",
              }}
            >
              * In order for Kaptn to work as intended (including install checks
              to the left), please ensure that{" "}
              <a
                style={{
                  color: theme.palette.mode === "dark" ? "lightgreen" : "green",
                  fontWeight: "400",
                }}
                href="https://kubernetes.io/docs/tasks/tools/"
              >
                kubectl commands are installed
              </a>
              <br />
              and clusters are up and running before proceeding.
            </Typography>
          </div>
        </div>

        <div
          style={{
            fontFamily: "Outfit",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "2px",
            margin: "15px 0 0 8.3%",
            textAlign: "left",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#3c3c9a",
            paddingTop: "10px",
            width: "95%",
            userSelect: "none",
          }}
        >
          QUICKSTART :
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            height: "172px",
            margin: "0 0 0% -2%",
          }}
        >
          <div>
            <Link to="/krane">
              <Button
                id="podButt"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  justifyContent: "space-around",
                  textAlign: "left",
                  alignItems: "space-between",
                  margin: "10px 0 0 20px",
                  padding: "0px 0px 0px 0px",
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
                  background:
                    theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
                }}
              >
                {" "}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <img
                    style={{
                      width: "29%",
                      marginLeft: "0px",
                      borderRadius: "5px",
                    }}
                    src="./kraneQuickStartImg2.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",
                      letterSpacing: "1px",
                      textTransform: "none",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      KAPTN KRANE —
                      <div
                        style={{
                          margin: "0 0 0 6px",
                          color:
                            theme.palette.mode === "dark"
                              ? "magenta"
                              : "#3c3c9a",
                        }}
                      >
                        {" "}
                        NEW!
                      </div>
                    </div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",

                        letterSpacing: ".2px",
                      }}
                    >
                      Manage your clusters, delete and scale resources, view
                      live metrics and much more in an easy-to-use interface
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>

          <div>
            <Link to="/dashboard">
              <Button
                id="podButt"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  justifyContent: "space-around",
                  textAlign: "left",
                  alignItems: "space-between",
                  margin: "10px 0 0 50px",
                  padding: "0px 0px 0px 0px",
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
                  background:
                    theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
                }}
              >
                {" "}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <img
                    style={{ width: "30%", marginLeft: "0px" }}
                    src="./kraneDashboardImg.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",

                      letterSpacing: "1px",
                    }}
                  >
                    <div>SUPERCHARGED CLI</div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                        letterSpacing: ".2px",
                      }}
                    >
                      Use our custom Command-Builder, and get instant help to
                      create kubectl commands and control your clusters
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            height: "172px",
            margin: "0 0 2% -2%",
          }}
        >
          <div>
            <Link to="/setup">
              <Button
                id="podButt"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  justifyContent: "space-around",
                  textAlign: "left",
                  alignItems: "space-between",
                  margin: "20px 0 0 20px",
                  padding: "0px 0px 0px 0px",
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
                  background:
                    theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
                }}
              >
                {" "}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <img
                    style={{
                      width: "29%",
                      marginLeft: "0px",
                      borderRadius: "5px",
                    }}
                    src="./kraneSetupImg.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",
                      letterSpacing: "1px",
                    }}
                  >
                    <div>EASY SETUP & LEARNING</div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                        letterSpacing: ".2px",
                      }}
                    >
                      Get instant help, follow tutorials, docu-mentation, and
                      use the .yaml generator to get started with K8s!
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>

          <div>
            <Link to="/cluster">
              <Button
                id="podButt"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  justifyContent: "space-around",
                  textAlign: "left",
                  alignItems: "space-between",
                  margin: "20px 0 0 50px",
                  padding: "0px 0px 0px 0px",
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
                  background:
                    theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
                }}
              >
                {" "}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <img
                    style={{
                      width: "29.9%",
                      marginLeft: "0px",
                      borderRadius: "5px",
                    }}
                    src="./kraneMetricsImg.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",
                      letterSpacing: "1px",
                    }}
                  >
                    <div>METRICS VISUALIZER</div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                        letterSpacing: ".2px",
                      }}
                    >
                      Sync with Grafana and Prometheus for real-time
                      visualization of your <br />
                      clusters health
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Start;
