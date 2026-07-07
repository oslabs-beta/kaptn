import React from "react";
import { render, screen } from "@testing-library/react";
import KraneDeploymentsList from "../../src/components/KraneDeploymentsList";
import "@testing-library/jest-dom";

jest.mock("electron", () => ({
  ipcRenderer: { on: jest.fn(), once: jest.fn(), send: jest.fn(), removeListener: jest.fn(), removeAllListeners: jest.fn() },
}));

const mockDeployment = {
  index: 0,
  namespace: "default",
  name: "nginx-deployment",
  ready: "3/3",
  readyNumerator: "3",
  readyDenominator: "3",
  upToDate: "3",
  available: "3",
  age: "10d",
  containers: "nginx",
  images: "nginx:1.14.2",
  selector: "app=nginx",
};

function buildProps(overrides = {}) {
  return {
    selectedNamespace: "ALL",
    getDeploymentsInfo: jest.fn(),
    deploymentsArr: [],
    setDeploymentsArr: jest.fn(),
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

describe("KraneDeploymentsList", () => {
  it("renders without crashing with empty deploymentsArr", () => {
    const { container } = render(
      <KraneDeploymentsList {...buildProps()} />
    );
    expect(container).toBeTruthy();
  });

  it("renders DEPLOYMENTS title", () => {
    render(<KraneDeploymentsList {...buildProps()} />);
    expect(screen.getByText("DEPLOYMENTS")).toBeInTheDocument();
  });

  it("shows 0 total when deploymentsArr is empty", () => {
    render(<KraneDeploymentsList {...buildProps()} />);
    expect(screen.getByText(/0 total/)).toBeInTheDocument();
  });

  it("renders deployment name when deploymentsArr has data", () => {
    render(
      <KraneDeploymentsList
        {...buildProps({ deploymentsArr: [mockDeployment] })}
      />
    );
    expect(screen.getByText("nginx-deployment")).toBeInTheDocument();
  });

  it("shows correct total count", () => {
    render(
      <KraneDeploymentsList
        {...buildProps({
          deploymentsArr: [
            mockDeployment,
            { ...mockDeployment, index: 1, name: "redis-deployment" },
          ],
        })}
      />
    );
    expect(screen.getByText(/2 total/)).toBeInTheDocument();
  });

  it("registers IPC listeners on mount", () => {
    const { ipcRenderer } = require("electron");
    ipcRenderer.on.mockClear();
    render(<KraneDeploymentsList {...buildProps()} />);
    const registeredEvents = ipcRenderer.on.mock.calls.map((c) => c[0]);
    expect(registeredEvents).toContain("got_deployments");
    expect(registeredEvents).toContain("got_rs");
  });

  it("filters by namespace when not ALL", () => {
    const otherNsDeploy = {
      ...mockDeployment,
      index: 1,
      name: "kube-dns",
      namespace: "kube-system",
    };
    render(
      <KraneDeploymentsList
        {...buildProps({
          selectedNamespace: "default",
          deploymentsArr: [mockDeployment, otherNsDeploy],
        })}
      />
    );
    expect(screen.getByText("nginx-deployment")).toBeInTheDocument();
    expect(screen.queryByText("kube-dns")).not.toBeInTheDocument();
  });
});
