import React from "react";
import {  useContext } from "react";
import { IconButton, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import {
  AutoFixHigh,
  ExitToAppOutlined,
  LightMode,
  BarChart,
  DarkMode,
} from "@mui/icons-material";
import { ColorModeContext } from "../theme";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import TerminalIcon from "@mui/icons-material/Terminal";

function SideNav(props) {
  // Color theme is toggled here with the light/dark mode menu item
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
      color: "white",
      fontSize: 11,
    },
  }));

  return (
    <div
      id="sidebarTopDiv"
      style={{
        backgroundColor: theme.palette.mode === "dark" ? "#170b49 " : "#cec5fc",
      }}
    >
      <LightTooltip
        title="Kaptn Krane"
        placement="right"
        arrow
        enterDelay={500}
        leaveDelay={200}
        enterNextDelay={500}
        style={{ backgroundColor: "red" }}
      >
        <div
          style={{ height: "20px", paddingLeft: "8px", marginBottom: "20px" }}
        >
          <Link to="/krane">
            <PrecisionManufacturingIcon
              className="menuIcons"
              fontSize="medium"
              style={{
                color: theme.palette.mode === "dark" ? "#c6bfe2" : "#6466b2",
              }}
            />
          </Link>
        </div>
      </LightTooltip>

      <LightTooltip
        title="K8s CLI"
        placement="right"
        arrow
        enterDelay={500}
        leaveDelay={200}
        enterNextDelay={500}
        style={{ backgroundColor: "red" }}
      >
        <div
          style={{ height: "20px", paddingLeft: "8px", marginBottom: "20px" }}
        >
          <Link to="/dashboard">
            <TerminalIcon
              className="menuIcons"
              fontSize="medium"
              style={{
                color: theme.palette.mode === "dark" ? "#c6bfe2" : "#6466b2",
              }}
            />
          </Link>
        </div>
      </LightTooltip>

      <LightTooltip
        title="Easy Setup"
        placement="right"
        arrow
        enterDelay={500}
        leaveDelay={200}
        enterNextDelay={500}
      >
        <div
          style={{ height: "20px", paddingLeft: "8px", marginBottom: "20px" }}
        >
          <Link to="/setup">
            <AutoFixHigh
              className="menuIcons"
              fontSize="medium"
              style={{
                color: theme.palette.mode === "dark" ? "#c6bfe2" : "#6466b2",
              }}
            />
          </Link>
        </div>
      </LightTooltip>

      <LightTooltip
        title="Cluster Metrics Visualizer"
        placement="right"
        arrow
        enterDelay={500}
        leaveDelay={200}
        enterNextDelay={500}
      >
        <div style={{ paddingLeft: "8px" }}>
          <Link to="/cluster">
            <BarChart
              className="menuIcons"
              fontSize="medium"
              style={{
                color: theme.palette.mode === "dark" ? "#c6bfe2" : "#6466b2",
              }}
            />
          </Link>
        </div>
      </LightTooltip>

      <LightTooltip
        title="Back to Start"
        placement="right"
        arrow
        enterDelay={500}
        leaveDelay={200}
        enterNextDelay={500}
      >
        <div style={{ paddingLeft: "8px", marginTop: "16px" }}>
          <Link to="/">
            <ExitToAppOutlined
              className="menuIcons"
              fontSize="medium"
              style={{
                color: theme.palette.mode === "dark" ? "#c6bfe2" : "#6466b2",
              }}
            />
          </Link>
        </div>
      </LightTooltip>
      <LightTooltip
        title="Dark / Light Mode"
        placement="right"
        arrow
        enterDelay={500}
        leaveDelay={200}
        enterNextDelay={500}
      >
        <div
          id="light-dark-button"
          style={{
            position: "fixed",
            bottom: "1px",
            left: "1px",
            zIndex: "1500",
          }}
        >
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <LightMode fontSize="small" style={{ color: "#ac98fa" }} />
            ) : (
              <DarkMode fontSize="small" style={{ color: "#5456ac" }} />
            )}
          </IconButton>
        </div>
      </LightTooltip>
    </div>
  );
}

export default SideNav;
