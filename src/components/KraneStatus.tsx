import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { ipcRenderer } from "../electron-ipc";

const METRICS_SERVER_INSTALL_URL =
  "https://github.com/kubernetes-sigs/metrics-server#installation";

// Shown when `kubectl top` fails because metrics-server isn't installed in the
// cluster, in place of gauges waiting on stats that can never arrive.
// "Install now" opens the official install docs in the in-app help window.
export function MetricsMissingNotice({ style }: { style?: React.CSSProperties }) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return (
    <div
      style={{
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
        userSelect: "none",
        color: dark ? "#ffffffcc" : "#3c3c9a",
        ...style,
      }}
    >
      Metrics server not found.{" "}
      <span
        onClick={() =>
          ipcRenderer.send("open_help_link", METRICS_SERVER_INSTALL_URL)
        }
        style={{
          color: dark ? "#b7aefc" : "#4b3fce",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Install now
      </span>
      .
    </div>
  );
}

// A Krane list is in exactly one of these states. Keeping them distinct is the
// whole point: an unreachable cluster must never look like an empty one.
export type KraneStatusState = "ok" | "empty" | "error" | "unreachable";

// Subscribes to a list command's "<channel>_status" event, which main.js sends
// only when kubectl fails, and clears the stale list when one arrives. The
// list's own data handler sets "ok" (data) or "empty" (no resources). Returns
// the current state plus the setter for that data handler to use.
export function useKraneListStatus(channel: string, clearList: () => void) {
  const [status, setStatus] = useState<KraneStatusState>("ok");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const onStatus = (
      _event: any,
      arg: { state: KraneStatusState; message?: string }
    ) => {
      setStatus(arg.state);
      setDetail(arg.message || "");
      clearList();
    };
    ipcRenderer.removeAllListeners(`${channel}_status`);
    ipcRenderer.on(`${channel}_status`, onStatus);
    return () => ipcRenderer.removeAllListeners(`${channel}_status`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, setStatus, detail };
}

// The single place that turns a non-"ok" state into what the user sees.
export function KraneStatusMessage({
  state,
  label,
  detail,
}: {
  state: KraneStatusState;
  label: string;
  detail?: string;
}) {
  if (state === "ok") return null;

  const text =
    state === "unreachable"
      ? "Can't reach your cluster — is Docker or minikube running?"
      : state === "error"
      ? "Something went wrong running kubectl."
      : `No ${label} found.`;

  return (
    <div
      style={{
        textAlign: "center",
        opacity: 0.7,
        padding: "48px 24px",
        fontFamily: "Outfit",
        fontSize: "15px",
      }}
    >
      {text}
      {state === "error" && detail ? (
        <pre
          style={{
            fontSize: "11px",
            opacity: 0.6,
            whiteSpace: "pre-wrap",
            marginTop: "12px",
            textAlign: "left",
          }}
        >
          {detail}
        </pre>
      ) : null}
    </div>
  );
}
