import React from "react";
import { useTheme } from "@mui/material";
import { CHART_RANGES } from "../lib/chartRanges";

// Source toggle (kubectl top = live default, Prometheus = historical) plus a
// time-range dropdown, rendered above a chart. Prometheus is disabled until the
// main process reports it reachable. Spread a useChartHistory() result in.
function ChartControls(props: any) {
  const {
    source,
    setSource,
    rangeLabel,
    setRangeLabel,
    promAvailable,
    loading,
  } = props;
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const pill = (active: boolean, disabled = false) => ({
    fontFamily: "Outfit",
    fontSize: "11px",
    letterSpacing: ".5px",
    padding: "4px 10px",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    border: `1px solid ${active ? "#8f85fb" : dark ? "#ffffff40" : "#00000030"}`,
    background: active ? "#8f85fb" : "transparent",
    color: active ? "white" : dark ? "#ffffffcc" : "#000000aa",
  });

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "center",
        margin: "4px 0 10px 0",
      }}
    >
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          type="button"
          onClick={() => setSource("kubectl")}
          style={pill(source === "kubectl")}
        >
          kubectl
        </button>
        <button
          type="button"
          disabled={!promAvailable}
          onClick={() => promAvailable && setSource("prometheus")}
          title={
            promAvailable
              ? "Historical data from Prometheus"
              : "Requires the cluster metrics setup + Grafana port-forward"
          }
          style={pill(source === "prometheus", !promAvailable)}
        >
          Prometheus
        </button>
      </div>

      <select
        value={rangeLabel}
        onChange={(e) => setRangeLabel(e.target.value)}
        style={{
          fontFamily: "Outfit",
          fontSize: "11px",
          padding: "4px 8px",
          borderRadius: "8px",
          border: `1px solid ${dark ? "#ffffff40" : "#00000030"}`,
          background: dark ? "#120838" : "white",
          color: dark ? "#ffffffcc" : "#000000aa",
        }}
      >
        {CHART_RANGES.map((r) => (
          <option key={r.label} value={r.label}>
            {r.label}
          </option>
        ))}
      </select>

      {/* absolutely positioned so toggling it never reflows / shifts the
          buttons and dropdown while a range or source is loading */}
      <span
        style={{
          position: "absolute",
          right: "-58px",
          fontSize: "11px",
          opacity: loading ? 0.6 : 0,
          fontFamily: "Outfit",
          pointerEvents: "none",
        }}
      >
        loading…
      </span>
    </div>
  );
}

export default ChartControls;
