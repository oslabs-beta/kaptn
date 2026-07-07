import React from "react";
import { render, screen } from "@testing-library/react";
import KraneNodeList from "../../src/components/KraneNodeList";
import "@testing-library/jest-dom";

jest.mock("electron", () => ({
  ipcRenderer: { on: jest.fn(), once: jest.fn(), send: jest.fn(), removeListener: jest.fn(), removeAllListeners: jest.fn() },
}));

const mockNode = {
  index: 0,
  name: "minikube-node-1",
  status: "Ready",
  role: "control-plane",
  age: "5d",
  version: "v1.26.1",
  internalIp: "192.168.49.2",
  externalIp: "<none>",
  osImage: "Ubuntu 20.04.5 LTS",
  kernal: "5.15.0-58-generic",
  containerRuntime: "docker://20.10.23",
  nodeCpuUsed: "250m",
  nodeCpuLimit: "2000",
  nodeCpuPercent: "12.5",
  nodeCpuPercentMath: "12.5",
  nodeMemoryUsed: "1200000",
  nodeMemoryUsedDisplay: "1.2Gi",
  nodeMemoryLimit: "4000000",
  nodeMemoryPercent: "30",
};

const defaultSelectedPod = [
  {
    index: "",
    name: "",
    ready: "",
    status: "",
    restarts: "",
    lastRestart: "",
    age: "",
    podCpuUsed: "",
    podCpuLimit: "",
    podCpuPercent: "",
    podMemoryUsed: "",
    podMemoryLimit: "",
    podMemoryPercent: "",
    ipAddress: "",
    node: "",
    nominatedNode: "",
    readinessGates: "",
    podContainers: [],
  },
];

function buildProps(overrides = {}) {
  return {
    nodesArr: [],
    setNodesArr: jest.fn(),
    nodesUsageArr: [],
    setNodesUsageArr: jest.fn(),
    nodesLimitsArr: [],
    setNodesLimitsArr: jest.fn(),
    podsArr: [],
    setPodsArr: jest.fn(),
    allPodsArr: [],
    setAllPodsArr: jest.fn(),
    podsContainersArr: [],
    setPodsContainersArr: jest.fn(),
    getNodesInfo: jest.fn(),
    openPod: false,
    setOpenPod: jest.fn(),
    openPodDelete: false,
    setOpenPodDelete: jest.fn(),
    openPodLog: false,
    setOpenPodLog: jest.fn(),
    podLogs: [],
    setPodLogs: jest.fn(),
    openPodYaml: false,
    setOpenPodYaml: jest.fn(),
    podYaml: [],
    setPodYaml: jest.fn(),
    openPodDescribe: false,
    setOpenPodDescribe: jest.fn(),
    podDescribe: [],
    setPodDescribe: jest.fn(),
    selectedPodStatusColor: "",
    setSelectedPodStatusColor: jest.fn(),
    selectedPodCPUColor: "",
    setSelectedPodCPUColor: jest.fn(),
    selectedPodMemoryColor: "",
    setSelectedPodMemoryColor: jest.fn(),
    selectedPodStatusColorLight: "",
    setSelectedPodStatusColorLight: jest.fn(),
    selectedPodCPUColorLight: "",
    setSelectedPodCPUColorLight: jest.fn(),
    selectedPodMemoryColorLight: "",
    setSelectedPodMemoryColorLight: jest.fn(),
    selectedPod: defaultSelectedPod,
    setSelectedPod: jest.fn(),
    podsStatsObj: {},
    setPodsStatsObj: jest.fn(),
    nodesStatsObj: {},
    setNodesStatsObj: jest.fn(),
    kraneDeployIPCcount: 0,
    setKraneDeployIPCCount: jest.fn(),
    currDir: "NONE SELECTED",
    ...overrides,
  };
}

describe("KraneNodeList", () => {
  it("renders without crashing with empty nodesArr", () => {
    const { container } = render(<KraneNodeList {...buildProps()} />);
    expect(container).toBeTruthy();
  });

  it("does not render NODES title when nodesArr is empty", () => {
    render(<KraneNodeList {...buildProps()} />);
    expect(screen.queryByText("NODES")).not.toBeInTheDocument();
  });

  it("renders NODES title when nodesArr has data", () => {
    render(<KraneNodeList {...buildProps({ nodesArr: [mockNode] })} />);
    expect(screen.getByText("NODES")).toBeInTheDocument();
  });

  it("shows total count when nodes are present", () => {
    render(
      <KraneNodeList {...buildProps({ nodesArr: [mockNode, { ...mockNode, index: 1, name: "minikube-node-2" }] })} />
    );
    expect(screen.getByText(/2 total/)).toBeInTheDocument();
  });

  it("renders node name as button when nodes are present", () => {
    render(<KraneNodeList {...buildProps({ nodesArr: [mockNode] })} />);
    expect(screen.getByText("minikube-node-1")).toBeInTheDocument();
  });

  it("registers IPC listeners on mount", () => {
    const { ipcRenderer } = require("electron");
    render(<KraneNodeList {...buildProps()} />);
    const registeredEvents = ipcRenderer.on.mock.calls.map((c) => c[0]);
    expect(registeredEvents).toContain("got_nodes");
    expect(registeredEvents).toContain("got_nodesCpuUsed");
  });
});
