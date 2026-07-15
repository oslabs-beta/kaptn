import { parseTopStats } from "../../src/lib/parseTopStats";

describe("parseTopStats", () => {
  const podsOutput = [
    "NAMESPACE     NAME             CPU(cores)   MEMORY(bytes)   ",
    "kube-system   etcd-minikube    37m          120Mi           ",
    "default       big-pod          1073m        2Gi             ",
    "default       zero-pod         0            0               ",
  ].join("\n");

  const nodesOutput = [
    "NAME       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%",
    "minikube   250m         6%     1800Mi          22%",
  ].join("\n");

  it("parses pods with namespace column, keying by pod name", () => {
    const stats = parseTopStats(podsOutput, "pods");
    expect(stats).toHaveLength(3);
    expect(stats[0]).toEqual({
      name: "etcd-minikube",
      cpu: 37,
      memory: 120000,
      memoryDisplay: "120Mi",
    });
  });

  it("scales Gi memory correctly", () => {
    const stats = parseTopStats(podsOutput, "pods");
    const big = stats.find((s) => s.name === "big-pod");
    expect(big).toEqual({
      name: "big-pod",
      cpu: 1073,
      memory: 2000000,
      memoryDisplay: "2Gi",
    });
  });

  it("handles zero cpu/memory", () => {
    const stats = parseTopStats(podsOutput, "pods");
    const zero = stats.find((s) => s.name === "zero-pod");
    expect(zero.cpu).toBe(0);
    expect(zero.memory).toBe(0);
  });

  it("parses nodes (name first, memory in 4th column)", () => {
    const stats = parseTopStats(nodesOutput, "nodes");
    expect(stats).toHaveLength(1);
    expect(stats[0]).toEqual({
      name: "minikube",
      cpu: 250,
      memory: 1800000,
      memoryDisplay: "1800Mi",
    });
  });

  it("returns [] for empty or header-only output", () => {
    expect(parseTopStats("", "pods")).toEqual([]);
    expect(parseTopStats("NAMESPACE NAME CPU MEMORY", "pods")).toEqual([]);
  });
});
