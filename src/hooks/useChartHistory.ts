import { useEffect, useState } from "react";
import { ipcRenderer } from "../electron-ipc";
import { CHART_RANGES } from "../lib/chartRanges";

// Backs the Krane chart source toggle + range dropdown. Default source is the
// local kubectl-top collection (App.tsx keeps podsStatsObj/nodesStatsObj filled
// from launch); the optional "prometheus" source fetches a historical range via
// the main process. Both return data in the same {date,cpu,memory,memoryDisplay}
// shape the charts already consume, so the chart component is unchanged.

let reqCounter = 0;

export type ChartSource = "kubectl" | "prometheus";

export function useChartHistory(kind: "pod" | "node", name: string) {
  const [source, setSource] = useState<ChartSource>("kubectl");
  const [rangeLabel, setRangeLabel] = useState("1h");
  const [promSeries, setPromSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [promAvailable, setPromAvailable] = useState(false);

  const rangeSeconds =
    CHART_RANGES.find((r) => r.label === rangeLabel)?.seconds ?? 3600;

  // Is Prometheus reachable (Grafana port-forward up)? Gates the toggle.
  // Re-check whenever the main process reports the port-forward status changed,
  // so the toggle enables once the auto-forward finishes — even if Krane was
  // opened before it was ready.
  useEffect(() => {
    const onAvail = (_e: any, ok: boolean) => setPromAvailable(!!ok);
    const recheck = () => ipcRenderer.send("promAvailable");
    ipcRenderer.on("prom_available", onAvail);
    ipcRenderer.on("port_forward_status", recheck);
    ipcRenderer.send("promAvailable");
    return () => {
      ipcRenderer.removeListener("prom_available", onAvail);
      ipcRenderer.removeListener("port_forward_status", recheck);
    };
  }, []);

  // Fetch the selected range from Prometheus while that source is active.
  useEffect(() => {
    if (source !== "prometheus" || !name) return;
    const reqId = ++reqCounter;
    setLoading(true);
    const onResult = (_e: any, payload: any) => {
      if (!payload || payload.reqId !== reqId) return; // ignore stale responses
      setPromSeries(Array.isArray(payload.series) ? payload.series : []);
      setLoading(false);
    };
    ipcRenderer.on("prom_range_result", onResult);
    ipcRenderer.send("promRangeQuery", { reqId, kind, name, rangeSeconds });
    return () => ipcRenderer.removeListener("prom_range_result", onResult);
  }, [source, name, rangeSeconds, kind]);

  // Produce the { [name]: points[] } object the chart consumes. For kubectl,
  // slice the in-memory buffer to the selected window; for prometheus, use the
  // fetched series.
  const getStatsObj = (localStatsObj: any) => {
    if (source === "prometheus") return { [name]: promSeries };
    const all = (localStatsObj && localStatsObj[name]) || [];
    const cutoff = Date.now() - rangeSeconds * 1000;
    return {
      [name]: all.filter((p: any) => new Date(p.date).getTime() >= cutoff),
    };
  };

  return {
    source,
    setSource,
    rangeLabel,
    setRangeLabel,
    promAvailable,
    loading,
    getStatsObj,
  };
}
