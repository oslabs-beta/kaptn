import Start from "./Pages/Start.jsx";
import Cluster from "./Pages/Cluster.jsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import KlusterManager from "./Pages/Krane";
import Topbar from "./components/Topbar.js";
import Setup from "./Pages/Setup.js";
import { ColorModeContext, useMode } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useState, useEffect } from "react";
import { ipcRenderer } from "./electron-ipc";
import { parseTopStats } from "./lib/parseTopStats";
import { mergeStatsHistory } from "./lib/statsHistory";

// cap history per pod/node so a long-running session doesn't grow unbounded:
// 5760 points at the 15s cadence below is ~24h of data.
const MAX_STATS_POINTS = 5760;

function App() {
  const [theme, colorMode] = useMode();

  const [promGrafCheckStatus, setPromGrafCheckStatus] = useState("checking");
  const [grafVersion, setGrafVersion] = useState("");
  const [promVersion, setPromVersion] = useState("");

  const [podsStatsObj, setPodsStatsObj] = useState({});
  const [nodesStatsObj, setNodesStatsObj] = useState({});
  const [intervalArray, setIntervalArray] = useState([]);

  // Persist the stats buffers across app restarts. A ref mirrors the latest
  // state so the save interval below always reads current data (its closure
  // would otherwise be frozen at mount).
  const statsRef = React.useRef<any>({ pods: {}, nodes: {} });
  useEffect(() => {
    statsRef.current = { pods: podsStatsObj, nodes: nodesStatsObj };
  }, [podsStatsObj, nodesStatsObj]);

  useEffect(() => {
    const onLoaded = (_event: any, saved: any) => {
      if (!saved) return;
      // merge behind whatever this session has already collected
      setPodsStatsObj((prev) =>
        mergeStatsHistory(saved.pods, prev, MAX_STATS_POINTS)
      );
      setNodesStatsObj((prev) =>
        mergeStatsHistory(saved.nodes, prev, MAX_STATS_POINTS)
      );
    };
    ipcRenderer.on("stats_history_loaded", onLoaded);
    ipcRenderer.send("loadStatsHistory");

    // Save every 5 minutes; worst case a quit loses the final <5min of points.
    // Kept infrequent deliberately: the send serializes the whole stats buffer
    // (which can reach tens of MB after hours of collection) on the UI thread,
    // so doing it every minute caused visible freezes as the buffer grew.
    const saveId = setInterval(() => {
      ipcRenderer.send("saveStatsHistory", statsRef.current);
    }, 300000);

    return () => {
      clearInterval(saveId);
      ipcRenderer.removeListener("stats_history_loaded", onLoaded);
    };
  }, []);

  // Collect CPU/memory history for pods and nodes from the moment the app
  // opens (not just when Krane is visited), so the charts have backfilled data
  // the first time you open them. Krane keeps appending to the same objects
  // when it's open — this just seeds and continues them cluster-wide.
  useEffect(() => {
    const appendStats = (setter, parsed) => {
      const date = new Date().toISOString();
      setter((prev) => {
        const next = { ...prev };
        for (const s of parsed) {
          const point = {
            date,
            cpu: s.cpu,
            memory: s.memory,
            memoryDisplay: s.memoryDisplay,
          };
          const arr = next[s.name] ? [...next[s.name], point] : [point];
          next[s.name] =
            arr.length > MAX_STATS_POINTS ? arr.slice(-MAX_STATS_POINTS) : arr;
        }
        return next;
      });
    };

    const onPods = (_event, arg) =>
      appendStats(setPodsStatsObj, parseTopStats(arg, "pods"));
    const onNodes = (_event, arg) =>
      appendStats(setNodesStatsObj, parseTopStats(arg, "nodes"));

    ipcRenderer.on("bg_got_podStats", onPods);
    ipcRenderer.on("bg_got_nodeStats", onNodes);

    const collect = () => {
      ipcRenderer.send("bgPodStats_command");
      ipcRenderer.send("bgNodeStats_command");
    };
    collect(); // seed immediately on app open
    const id = setInterval(collect, 15000);

    return () => {
      clearInterval(id);
      ipcRenderer.removeListener("bg_got_podStats", onPods);
      ipcRenderer.removeListener("bg_got_nodeStats", onNodes);
    };
  }, []);


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
