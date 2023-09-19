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

function Start() {
  //for light/dark mode toggle
  const theme = useTheme();

  // CHECK KUBECTL VERSION SECTION
  const [kubectlCheckStatus, setKubectlCheckStatus] = useState("checking");
  const [kubectlClient, setKubectlClient] = useState("");
  const [kubectlServer, setKubectlServer] = useState("");

  let argOut = "";

  ipcRenderer.on("checked_kubectl_installed", (event, arg) => {
    argOut = arg;
    let kubectlClientVersion = [];
    let kubectlServerVersion = [];
    console.log("attempted to check if kubectl installed:", arg);
    //if first letter is "W" you are getting version warning, so this parses version warning output
    if (arg[0] === "W") {
      let i = 44;
      while (arg[i] !== ")") {
        kubectlClientVersion.push(arg[i]);
        i++;
      }
      i += 14;
      while (arg[i] !== ")") {
        kubectlServerVersion.push(arg[i]);
        i++;
      }
      setKubectlClient(`${kubectlClientVersion.join("")}`);
      console.log("kubectl client is:", kubectlClient);

      setKubectlServer(`${kubectlServerVersion.join("")}`);
      console.log("kubectl server is:", kubectlServer);
      setTimeout(() => {
        setKubectlCheckStatus("Installed");
      }, 800);
    }
    //need to parse json object below this line and save client and server versions for when you dont have warning (like i currently do).
    else if (typeof arg === "object") {
      //parse json object
    }
  });

  let kubectlCheckKubectlInstallCommand = "kubectl version --output=json";

  let currDir = "NONE SELECTED";
  useEffect(() => {
    ipcRenderer.send("check_kubectl_installed", {
      kubectlCheckKubectlInstallCommand,
      currDir,
    });
  }, []);

  let kubectlInstalledDiv;
  if (kubectlCheckStatus === "Installed") {
    kubectlInstalledDiv = (
      <div
        style={{
          fontSize: "11px",
          // border: "1px solid green",
          display: "flex",
          flexDirection: "row",
        }}
      >
        kubectl client version v{kubectlClient} and server version v
        {kubectlServer} found
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
          // border: "1px solid green",
          display: "flex",
          flexDirection: "row",
        }}
      >
        checking if kubectl commands are installed ...
      </div>
    );
  }

  // END OF CHECK KUBECTL INSTALLED SECTION

  // command for check if metrics server installed is: kubectl get pods --all-namespaces | grep metrics-server
  // if result is empty string, nothing installed, else it is installed.

  // let argOut = "";

  // let kubectlMetricsServerInstallCommand =
  //   "kubectl apply -f https://raw.githubusercontent.com/pythianarora/total-practice/master/sample-kubernetes-code/metrics-server.yaml";

  // let currDir = "NONE SELECTED";

  // ipcRenderer.send("install_metrics_server_command", {
  //   kubectlMetricsServerInstallCommand,
  //   currDir,
  // });

  // ipcRenderer.on("installed_metrics", (event, arg) => {
  //   argOut = arg;
  //   console.log("attempted to install metrics server:", arg);
  // });

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "auto",
          height: "768px",
          // border: "1px solid red",
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
            // border: "1px solid white",
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
              // border: "1px solid green",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box
              src="./kaptn4ico.png"
              sx={{
                margin: "80px 0 40px 0",
                height: "270px",
                width: "270px",
                justifyContent: "center",
                alignItems: "center",
                WebkitUserSelect: "none",
              }}
              component="img"
              width="50%"
            ></Box>

            {kubectlInstalledDiv}
            {/* <div
              style={{
                fontSize: "11px",
                // border: "1px solid green",
                display: "flex",
                flexDirection: "row",
              }}
            >
              kubectl version 1.12 found
              <CheckIcon
                fontSize="small"
                style={{ margin: "-1px 0 0 5px", color: "lightgreen" }}
              />
            </div> */}

            <div
              style={{
                fontSize: "11px",
                // border: "1px solid green",
                display: "flex",
                flexDirection: "row",
              }}
            >
              kubectl metrics server not installed.{" "}
              <a href="" style={{ marginLeft: "2px", color: "lightgreen" }}>
                Install now
              </a>
            </div>

            <div
              style={{
                fontSize: "11px",
                // border: "1px solid green",
                display: "flex",
                flexDirection: "row",
              }}
            >
              Grafana and Prometheus version 1.45 found{" "}
              <CheckIcon
                fontSize="small"
                style={{ margin: "-1px 0 0 5px", color: "lightgreen" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: "50%",
              height: "100%",
              // border: "1px solid blue",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              // alignText='center'
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
              variant="h4"
              align="center"
              sx={{
                fontFamily: "Outfit",
                fontWeight: 300,
                fontSize: "32px",
                letterSpacing: ".05px",
                color: "#f5f5f5",
                textDecoration: "none",
                mt: 2,
                mb: 8,
                mr: 3,
                ml: 3,
                zIndex: "130",
                textShadow: "1px 1px 5px rgb(0, 0, 0, 0.3)",
              }}
            >
              {" "}
              take command of kubernetes
              {/* Unlock the full power of the kubernetes command kubectl, while
              easily initializing and monitoring kubernetes clusters */}
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
                color: "#f5f5f5",
                textDecoration: "none",
                mt: 3,
                mb: 0,
                mr: 3,
                ml: 3,
                zIndex: "130",
                textShadow: "1px 1px 5px rgb(0, 0, 0, 0.3)",
              }}
            >
              * If this is your first time, please ensure that{" "}
              <a
                style={{ color: "lightgreen", fontWeight: "400" }}
                href="https://kubernetes.io/docs/tasks/tools/"
              >
                kubectl commands are installed
              </a>{" "}
              and/or clusters are up and running before proceeding.
            </Typography>
          </div>
          {/* <Button style={{ border: "1px solid blue" }}>Blah</Button> */}
        </div>

        <div
          style={{
            fontFamily: "Outfit",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "2px",
            margin: "15px 0 0 8.3%",
            // border: "1px solid white",
            textAlign: "left",
            color: "#ffffff",
            paddingTop: "10px",
            width: "95%",
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
            // border: "1px solid yellow",
          }}
        >
          <div>
            <Link to="/krane">
              <Button
                id="podButt"
                // onClick={() => handleCommandOpen(podsArr[i])}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  // border: "1px solid white",
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
                    // border: "1px solid green",
                    width: "100%",
                  }}
                >
                  <img
                    style={{
                      width: "29%",
                      marginLeft: "0px",
                      borderRadius: "5px",
                    }}
                    src="../../kraneQuickStartImg2.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",
                    }}
                  >
                    <div>KAPTN KLUSTER MANAGER</div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
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
                // onClick={() => handleCommandOpen(podsArr[i])}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  // border: "1px solid white",
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
                    // border: "1px solid green",
                    width: "100%",
                  }}
                >
                  <img
                    style={{ width: "30%", marginLeft: "0px" }}
                    src="../../kraneDashboardImg.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",
                    }}
                  >
                    <div>KAPTN SUPERCHARGED CLI</div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
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
            // border: "1px solid yellow",
          }}
        >
          <div>
            <Link to="/setup">
              <Button
                id="podButt"
                // onClick={() => handleCommandOpen(podsArr[i])}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  // border: "1px solid white",
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
                    // border: "1px solid green",
                    width: "100%",
                  }}
                >
                  <img
                    style={{
                      width: "29%",
                      marginLeft: "0px",
                      borderRadius: "5px",
                    }}
                    src="../../kraneSetupImg.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",
                    }}
                  >
                    <div>KAPTN EASY SETUP</div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
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
                // onClick={() => handleCommandOpen(podsArr[i])}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "450px",
                  height: "115px",
                  fontSize: "16px",
                  textTransform: "none",
                  // border: "1px solid white",
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
                    // border: "1px solid green",
                    width: "100%",
                  }}
                >
                  <img
                    style={{
                      width: "28.2%",
                      marginLeft: "0px",
                      borderRadius: "5px",
                    }}
                    src="../../kraneMetricsImg.png"
                  ></img>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: "20px",
                      fontWeight: "900",
                      display: "flex",
                      margin: "10px 20px 0 20px",
                      flexDirection: "column",
                    }}
                  >
                    <div>KAPTN METRICS VISUALIZER</div>

                    <div
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                      }}
                    >
                      Sync with Grafana and Prometheus for real-time
                      visualization of your clusters health
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>

    // <Grid
    //   id="login-content"
    //   container
    //   alignContent="center"
    //   alignItems="center"
    //   justifyContent="center"
    //   width={"100%"}
    //   // height={'95vh'}
    //   style={{
    //     marginTop: "32px",
    //     height: "100%",
    //   }}
    // >
    //   <Grid
    //     id="main-content-center"
    //     container
    //     flexDirection="column"
    //     alignItems="center"
    //     justifyContent="space-evenly"
    //     sx={{
    //       textAlign: "center",
    //       width: "100%",
    //       backgroundColor: theme.palette.mode === "dark" ? "" : "#c8c8fc",
    //     }}
    //     height={"96vh"}
    //   >
    //     <Box
    //       src="./kaptn4ico.png"
    //       sx={{
    //         marginTop: "40px",
    //         height: "270px",
    //         width: "270px",
    //       }}
    //       component="img"
    //       width="100%"
    //     ></Box>
    //     <Box id="subtitle">
    //       <Typography
    //         variant="h2"
    //         // alignText='center'
    //         sx={{ fontWeight: "bold", fontFamily: "Outfit", fontSize: "42px" }}
    //         style={{
    //           color: theme.palette.mode === "dark" ? "white" : "#3c3c9a",
    //           textShadow:
    //             theme.palette.mode === "dark"
    //               ? "1px 1px 5px rgb(0, 0, 0, 0.3)"
    //               : "1px 1px 5px rgb(0, 0, 0, 0.0)",
    //         }}
    //       >
    //         Take command of Kubernetes.
    //       </Typography>
    //     </Box>

    //     <Link to="/welcome">
    //       <Button
    //         variant="contained"
    //         type="submit"
    //         size="large"
    //         sx={{
    //           display: "flex",
    //           flexDirection: "column",
    //           alignItems: "start",
    //           fontSize: "20px",
    //           fontFamily: "Outfit",
    //           padding: "7px 30px 7px 30px",
    //           transitionProperty: "background-image",
    //           transition: "all 2s",
    //           mozTransition: "all 2s",
    //           webkitTransition: "all 2s",
    //           oTransition: "all 2s",
    //           border:
    //             theme.palette.mode === "dark"
    //               ? "1px solid #68617f"
    //               : "3px solid #9621f9",
    //           letterSpacing: "3.5px",
    //           backgroundColor:
    //             theme.palette.mode === "dark" ? "#22145a" : "#3c3c9a",
    //           // mt: 2,
    //           // mb: 3,
    //           ":hover": {
    //             backgroundColor:
    //               theme.palette.mode === "dark" ? "#a021f9" : "#8e77ec",
    //             backgroundImage:
    //               theme.palette.mode === "dark"
    //                 ? "linear-gradient(to right top, #dc44e3, #c53fe0, #ac3add, #9237d9, #7634d5, #6c33d6, #6132d8, #5432d9, #5f32e1, #6933e9, #7433f0, #7f32f8)"
    //                 : "linear-gradient(to right bottom, #5d2aed, #7329e7, #8529e1, #932adc, #9f2cd6, #a12dd7, #a32ed8, #a52fd9, #9e2fe0, #952fe8, #8b30f0, #7f32f8);",
    //             border:
    //               theme.palette.mode === "dark"
    //                 ? "1px solid #af21f9"
    //                 : "3px solid #9621f9",
    //           },
    //         }}
    //       >
    //         CONTINUE
    //       </Button>
    //     </Link>
    //     <Typography variant="caption">Copyright © Kaptn 2023. </Typography>
    //   </Grid>
    // </Grid>
  );
}
export default Start;
