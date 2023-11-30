import Start from "./Pages/Start.jsx";
import Cluster from "./Pages/Cluster.jsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import KlusterManager from "./Pages/Krane";
import Topbar from "./components/Topbar.js";
import Setup from "./Pages/Setup.js";
import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useState } from "react";

function App() {
  const [theme, colorMode] = useMode();

  const [promGrafCheckStatus, setPromGrafCheckStatus] = useState("checking");
  const [grafVersion, setGrafVersion] = useState("");
  const [promVersion, setPromVersion] = useState("");


  const [podsStatsObj, setPodsStatsObj] = useState({});
  const [nodesStatsObj, setNodesStatsObj] = useState({});
  const [intervalArray, setIntervalArray] = useState([]);
  

  // Hash router is used here to optimize for static file serving from Electron
  // More information here: https://reactrouter.com/en/main/router-components/hash-router
  return (
    <HashRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App" id="root">
            <Topbar />
            <main className="content">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Start
                      promGrafCheckStatus={promGrafCheckStatus}
                      setPromGrafCheckStatus={setPromGrafCheckStatus}
                      grafVersion={grafVersion}
                      setGrafVersion={setGrafVersion}
                      promVersion={promVersion}
                      setPromVersion={setPromVersion}
                      podsStatsObj={podsStatsObj}
                      setPodsStatsObj={setPodsStatsObj}
                      nodesStatsObj={nodesStatsObj}
                      setNodesStatsObj={setNodesStatsObj}
                      intervalArray={intervalArray}
                      setIntervalArray={setIntervalArray}
                    />
                  }
                />
                <Route
                  path="/krane"
                  element={
                    <KlusterManager
                      promGrafCheckStatus={promGrafCheckStatus}
                      setPromGrafCheckStatus={setPromGrafCheckStatus}
                      grafVersion={grafVersion}
                      setGrafVersion={setGrafVersion}
                      promVersion={promVersion}
                      setPromVersion={setPromVersion}
                      podsStatsObj={podsStatsObj}
                      setPodsStatsObj={setPodsStatsObj}
                      nodesStatsObj={nodesStatsObj}
                      setNodesStatsObj={setNodesStatsObj}
                      intervalArray={intervalArray}
                      setIntervalArray={setIntervalArray}
                    />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard
                      //@ts-expect-error
                      promGrafCheckStatus={promGrafCheckStatus}
                      setPromGrafCheckStatus={setPromGrafCheckStatus}
                      grafVersion={grafVersion}
                      setGrafVersion={setGrafVersion}
                      promVersion={promVersion}
                      setPromVersion={setPromVersion}
                      podsStatsObj={podsStatsObj}
                      setPodsStatsObj={setPodsStatsObj}
                      nodesStatsObj={nodesStatsObj}
                      setNodesStatsObj={setNodesStatsObj}
                      intervalArray={intervalArray}
                      setIntervalArray={setIntervalArray}
                    />
                  }
                />
                <Route
                  path="/setup"
                  element={
                    <Setup
                      //@ts-expect-error
                      promGrafCheckStatus={promGrafCheckStatus}
                      setPromGrafCheckStatus={setPromGrafCheckStatus}
                      grafVersion={grafVersion}
                      setGrafVersion={setGrafVersion}
                      promVersion={promVersion}
                      setPromVersion={setPromVersion}
                      podsStatsObj={podsStatsObj}
                      setPodsStatsObj={setPodsStatsObj}
                      nodesStatsObj={nodesStatsObj}
                      setNodesStatsObj={setNodesStatsObj}
                      intervalArray={intervalArray}
                      setIntervalArray={setIntervalArray}
                    />
                  }
                />
                <Route
                  path="/cluster"
                  element={
                    <Cluster
                      promGrafCheckStatus={promGrafCheckStatus}
                      setPromGrafCheckStatus={setPromGrafCheckStatus}
                      grafVersion={grafVersion}
                      setGrafVersion={setGrafVersion}
                      promVersion={promVersion}
                      setPromVersion={setPromVersion}
                      podsStatsObj={podsStatsObj}
                      setPodsStatsObj={setPodsStatsObj}
                      nodesStatsObj={nodesStatsObj}
                      setNodesStatsObj={setNodesStatsObj}
                      intervalArray={intervalArray}
                      setIntervalArray={setIntervalArray}
                    />
                  }
                />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </HashRouter>
  );
}

export default App;
