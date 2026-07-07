import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cluster from "../../src/Pages/Cluster";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

jest.mock("electron", () => {
  const mElectron = {
    ipcRenderer: {
      on: jest.fn(),
      send: jest.fn(),
      removeListener: jest.fn(),
    },
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

  it("renders the LOG IN THROUGH BROWSER button", () => {
    expect(screen.getByText(/LOG IN THROUGH BROWSER/)).toBeInTheDocument();
  });

  it("renders the HELPFUL TIP section", () => {
    expect(screen.getByText("HELPFUL TIP!")).toBeInTheDocument();
  });

  it("displays default Grafana credentials", () => {
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("prom-operator")).toBeInTheDocument();
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
    const button = screen.getByText(/LOG IN THROUGH BROWSER/);
    fireEvent.click(button);
    expect(ipcRenderer.send).toHaveBeenCalledWith("retrieve_key");
  });
});
