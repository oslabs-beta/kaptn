// Parser for `kubectl top pods --all-namespaces` and `kubectl top nodes`
// output, used by the app-level background stats collector. Produces the same
// shape and units the Krane charts already expect: CPU in millicores, memory
// scaled (Mi -> x1000, Gi -> x1000000) with a human-readable display string.

export interface TopStat {
  name: string;
  cpu: number;
  memory: number;
  memoryDisplay: string;
}

// "37m" -> 37, "0" -> 0. kubectl top reports pod/node CPU in millicores.
function toCpu(raw: string): number {
  const digits = raw.match(/\d+/);
  return digits ? Number(digits[0]) : 0;
}

// "120Mi" -> { memory: 120000, display: "120Mi" }; "2Gi" -> 2000000.
function toMemory(raw: string): { memory: number; display: string } {
  const m = raw.match(/^(\d+)\s*([A-Za-z]+)?/);
  if (!m) return { memory: 0, display: raw };
  const value = m[1];
  const unit = m[2] || "";
  if (unit.startsWith("G")) return { memory: Number(value) * 1000000, display: `${value}Gi` };
  if (unit.startsWith("M")) return { memory: Number(value) * 1000, display: `${value}Mi` };
  return { memory: Number(value), display: raw };
}

// pods (--all-namespaces): NAMESPACE  NAME  CPU(cores)  MEMORY(bytes)
// nodes:                   NAME  CPU(cores)  CPU%  MEMORY(bytes)  MEMORY%
export function parseTopStats(output: string, kind: "pods" | "nodes"): TopStat[] {
  const lines = output.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) return []; // header only or empty
  const stats: TopStat[] = [];
  for (const line of lines.slice(1)) {
    const f = line.split(/\s+/);
    if (kind === "pods") {
      if (f.length < 4) continue;
      const { memory, display } = toMemory(f[3]);
      stats.push({ name: f[1], cpu: toCpu(f[2]), memory, memoryDisplay: display });
    } else {
      if (f.length < 5) continue;
      const { memory, display } = toMemory(f[3]);
      stats.push({ name: f[0], cpu: toCpu(f[1]), memory, memoryDisplay: display });
    }
  }
  return stats;
}
