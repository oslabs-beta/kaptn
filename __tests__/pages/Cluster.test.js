import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Cluster from "../../src/Pages/Cluster";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

jest.mock("electron", () => {
  const mElectron = {
    ipcRenderer: {
      on: jest.fn(),
      once: jest.fn(),
      send: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
    },
    clipboard: { writeText: jest.fn() },
  };
  return mElectron;
});

const defaultProps = {
  promGrafCheckStatus: "checking",
  setPromGrafCheckStatus: jest.fn(),
  grafVersion: "",
  setGrafVersion: jest.fn(),
  promVersion: "",
  setPromVersion: jest.fn(),
  podsStatsObj: {},
  setPodsStatsObj: jest.fn(),
  nodesStatsObj: {},
  setNodesStatsObj: jest.fn(),
  intervalArray: [],
  setIntervalArray: jest.fn(),
};

describe("Cluster page", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Cluster {...defaultProps} />
      </BrowserRouter>
    );
  });

  it("renders the CLUSTER METRICS VISUALIZER title", () => {
    expect(screen.getByText("CLUSTER METRICS VISUALIZER")).toBeInTheDocument();
  });

  it("renders setup instruction text", () => {
    expect(
      screen.getByText("PLEASE FOLLOW THE STEPS BELOW IN ORDER:")
    ).toBeInTheDocument();
  });

  it("renders the Set up Prometheus button", () => {
    expect(screen.getByText("Set up Prometheus")).toBeInTheDocument();
  });

  it("renders the Set up Grafana button", () => {
    expect(screen.getByText("Set up Grafana")).toBeInTheDocument();
  });

  it("renders the Start port forwarding button", () => {
    expect(screen.getByText("Start port forwarding")).toBeInTheDocument();
  });

  it("renders the OPEN METRICS VISUALIZER button", () => {
    expect(screen.getByText(/OPEN METRICS VISUALIZER/)).toBeInTheDocument();
  });

  it("renders the HELPFUL TIP section", () => {
    expect(screen.getByText("HELPFUL TIP!")).toBeInTheDocument();
  });

  it("requests the live Grafana password on mount", () => {
    const { ipcRenderer } = require("electron");
    expect(ipcRenderer.send).toHaveBeenCalledWith("get_grafana_password");
  });

  it("masks the fetched Grafana password until revealed", () => {
    const { ipcRenderer } = require("electron");
    expect(screen.getByText("admin")).toBeInTheDocument();

    // simulate the main process returning the live password over IPC
    const call = ipcRenderer.once.mock.calls
      .filter((c) => c[0] === "get_grafana_password")
      .pop();
    const respond = call[1];
    act(() => respond(null, "test-grafana-pw-123"));

    // masked by default
    expect(screen.queryByText("test-grafana-pw-123")).not.toBeInTheDocument();

    // reveal it
    fireEvent.click(screen.getByTitle("Reveal password"));
    expect(screen.getByText("test-grafana-pw-123")).toBeInTheDocument();
  });

  it("copies the password to the clipboard", () => {
    const { ipcRenderer, clipboard } = require("electron");
    const call = ipcRenderer.once.mock.calls
      .filter((c) => c[0] === "get_grafana_password")
      .pop();
    act(() => call[1](null, "test-grafana-pw-123"));

    fireEvent.click(screen.getByTitle("Copy password"));
    expect(clipboard.writeText).toHaveBeenCalledWith("test-grafana-pw-123");
  });

  it("sends prom_setup IPC message when Prometheus button clicked", () => {
    const { ipcRenderer } = require("electron");
    const button = screen.getByText("Set up Prometheus");
    fireEvent.click(button);
    expect(ipcRenderer.send).toHaveBeenCalledWith("prom_setup");
  });

  it("sends graf_setup IPC message when Grafana button clicked", () => {
    const { ipcRenderer } = require("electron");
    const button = screen.getByText("Set up Grafana");
    fireEvent.click(button);
    expect(ipcRenderer.send).toHaveBeenCalledWith("graf_setup");
  });

  it("sends forward_ports IPC message when port forward button clicked", () => {
    const { ipcRenderer } = require("electron");
    const button = screen.getByText("Start port forwarding");
    fireEvent.click(button);
    expect(ipcRenderer.send).toHaveBeenCalledWith("forward_ports");
  });

  it("sends retrieve_key IPC message when launch button clicked", () => {
    const { ipcRenderer } = require("electron");
    const button = screen.getByText(/OPEN METRICS VISUALIZER/);
    fireEvent.click(button);
    expect(ipcRenderer.send).toHaveBeenCalledWith("retrieve_key");
  });
});
