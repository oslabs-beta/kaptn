import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { ipcRenderer } from "../electron-ipc";

function Topbar(): JSX.Element {
  const theme = useTheme();
  const [customConfigPath, setCustomConfigPath] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    ipcRenderer.invoke("get_kubeconfig").then((p: string) => {
      if (p) setCustomConfigPath(p);
    });
    // Stay in sync when the config is changed/reset from anywhere. Named handler
    // + removeListener so we don't clobber Krane's listener on the same channel.
    const onChange = (_e: any, p: string) => setCustomConfigPath(p || "");
    ipcRenderer.on("kubeconfig_changed", onChange);
    return () => ipcRenderer.removeListener("kubeconfig_changed", onChange);
  }, []);

  // Same lavender-purple as the Start page text links.
  const linkStyle: React.CSSProperties = {
    color: theme.palette.mode === "dark" ? "#b7aefc" : "#4b3fce",
    cursor: "pointer",
    textDecoration: "underline",
  };

  const changeConfig = async () => {
    const filePath = await ipcRenderer.invoke("choose_kubeconfig");
    if (!filePath) return;
    ipcRenderer.send("set_kubeconfig", filePath);
    setOpen(false);
  };
  const resetConfig = () => {
    ipcRenderer.send("set_kubeconfig", "");
    setOpen(false);
  };

  return (
    <div
      id="top-bar2"
      style={{
        display: "flex",
        position: "fixed",
        top: "0",
        left: "0",
        height: "32px",
        width: "100%",
        justifyContent: "left",
        backgroundColor: theme.palette.mode === "dark" ? "#170b49" : "#9d8edc",
        zIndex: 14000,
      }}
    >
      <div
        style={{
          width: "73px",
          height: "100%",
          backgroundColor:
            theme.palette.mode === "dark" ? "#170b49" : "#9d8edc",
          zIndex: 1000,
        }}
      ></div>
      <div
        style={
          {
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            WebkitAppRegion: "drag",
            WebkitUserSelect: "none",
          } as React.CSSProperties
        }
      >
        <div
          style={{
            fontFamily: "Outfit",
            justifyContent: "center",
            fontWeight: "700",
            letterSpacing: ".8px",
            fontSize: 22,
            color: "White",
          }}
        >
          kaptn
        </div>
      </div>
      <div
        style={
          {
            width: "73px",
            height: "100%",
            WebkitAppRegion: "drag",
          } as React.CSSProperties
        }
      ></div>

      {/* Custom-kubeconfig indicator, pinned to the right of the title bar.
          no-drag so it stays clickable; only shown when a custom config is set. */}
      {customConfigPath ? (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={() => setOpen(true)}
          style={
            {
              position: "absolute",
              right: "18px",
              top: "0",
              height: "32px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              cursor: "pointer",
              WebkitAppRegion: "no-drag",
            } as React.CSSProperties
          }
        >
          <span
            style={{
              fontFamily: "Outfit",
              fontSize: "10.5px",
              fontWeight: 400,
              letterSpacing: ".3px",
              color: "#ffffffdd",
              whiteSpace: "nowrap",
            }}
          >
            CUSTOM .KUBE/CONFIG
          </span>
          <span
            className="status-glow"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              color: "#ffffff",
              flexShrink: 0,
            }}
          />

          {open ? (
            <div
              style={{
                position: "absolute",
                top: "32px",
                right: "0",
                minWidth: "240px",
                maxWidth: "460px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#241457" : "#ffffff",
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                color: theme.palette.mode === "dark" ? "#ffffffcc" : "#333",
                fontFamily: "Outfit",
                textAlign: "right",
                cursor: "default",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  wordBreak: "break-all",
                  opacity: 0.85,
                }}
              >
                {customConfigPath}
              </div>
              <div
                style={{ fontSize: "12px", marginTop: "5px", fontWeight: 600 }}
              >
                <span onClick={resetConfig} style={linkStyle}>
                  Reset
                </span>
                <span style={{ opacity: 0.6 }}> or </span>
                <span onClick={changeConfig} style={linkStyle}>
                  Change
                </span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default Topbar;
