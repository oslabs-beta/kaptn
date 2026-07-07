import React from "react";
import { render, screen } from "@testing-library/react";
import KranePodList from "../../src/components/KranePodList";
import "@testing-library/jest-dom";

jest.mock("electron", () => ({
  ipcRenderer: { on: jest.fn(), once: jest.fn(), send: jest.fn(), removeListener: jest.fn(), removeAllListeners: jest.fn() },
}));

const mockPod = {
  index: 0,
  namespace: "default",
  name: "nginx-deployment-abc123",
  ready: "1/1",
  status: "Running",
  restarts: "0",
  lastRestart: "<none>",
  age: "2d",
  podCpuUsed: "10m",
  podMemoryUsed: "50000",
  podMemoryUsedDisplay: "50Mi",
  podCpuLimit: "500",
  podMemoryLimit: "256000",
  podMemoryLimitDisplay: "256Mi",
  ipAddress: "172.17.0.3",
  node: "minikube",
  nominatedNode: "<none>",
  readinessGates: "<none>",
  podContainers: [],
  podCpuPercent: "2",
  podMemoryPercent: "19.5",
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
    selectedNamespace: "ALL",
    podsArr: [],
    setPodsArr: jest.fn(),
    allPodsArr: [],
    setAllPodsArr: jest.fn(),
    getPodsAndContainers: jest.fn(),
    currDir: "NONE SELECTED",
    setCurrDir: jest.fn(),
    podsContainersArr: [],
    setPodsContainersArr: jest.fn(),
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
    ...overrides,
  };
}

describe("KranePodList", () => {
  it("renders without crashing with empty podsArr", () => {
    const { container } = render(<KranePodList {...buildProps()} />);
    expect(container).toBeTruthy();
  });

  it("does not render PODS title when podsArr is empty", () => {
    render(<KranePodList {...buildProps()} />);
    expect(screen.queryByText("PODS")).not.toBeInTheDocument();
  });

  it("renders PODS title when podsArr has data", () => {
    render(<KranePodList {...buildProps({ podsArr: [mockPod] })} />);
    expect(screen.getByText("PODS")).toBeInTheDocument();
  });

  it("shows total count when pods are present", () => {
    render(
      <KranePodList
        {...buildProps({
          podsArr: [mockPod, { ...mockPod, index: 1, name: "redis-pod-xyz" }],
        })}
      />
    );
    expect(screen.getByText(/2 total/)).toBeInTheDocument();
  });

  it("renders pod name when pods are present", () => {
    render(<KranePodList {...buildProps({ podsArr: [mockPod] })} />);
    expect(screen.getByText("nginx-deployment-abc123")).toBeInTheDocument();
  });

  it("displays pod status", () => {
    render(<KranePodList {...buildProps({ podsArr: [mockPod] })} />);
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("registers IPC listeners on mount", () => {
    const { ipcRenderer } = require("electron");
    ipcRenderer.on.mockClear();
    render(<KranePodList {...buildProps()} />);
    const registeredEvents = ipcRenderer.on.mock.calls.map((c) => c[0]);
    expect(registeredEvents).toContain("got_pods");
    expect(registeredEvents).toContain("got_cpuUsed");
    expect(registeredEvents).toContain("got_cpuLimits");
  });

  it("renders sort button when pods are present", () => {
    render(<KranePodList {...buildProps({ podsArr: [mockPod] })} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
