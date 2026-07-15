import { mergeStatsHistory } from "../../src/lib/statsHistory";
import { makeGapDefined } from "../../src/lib/chartGaps";

const pt = (iso, cpu = 1) => ({ date: iso, cpu, memory: 1000, memoryDisplay: "1Mi" });

describe("mergeStatsHistory", () => {
  it("prepends loaded points before current ones, sorted by date", () => {
    const loaded = { a: [pt("2026-07-09T10:00:00Z"), pt("2026-07-09T10:00:15Z")] };
    const current = { a: [pt("2026-07-09T12:00:00Z")] };
    const merged = mergeStatsHistory(loaded, current, 100);
    expect(merged.a.map((p) => p.date)).toEqual([
      "2026-07-09T10:00:00Z",
      "2026-07-09T10:00:15Z",
      "2026-07-09T12:00:00Z",
    ]);
  });

  it("drops duplicate timestamps", () => {
    const loaded = { a: [pt("2026-07-09T10:00:00Z", 5)] };
    const current = { a: [pt("2026-07-09T10:00:00Z", 5), pt("2026-07-09T10:00:15Z")] };
    const merged = mergeStatsHistory(loaded, current, 100);
    expect(merged.a).toHaveLength(2);
  });

  it("caps to the newest points", () => {
    const loaded = { a: [pt("2026-07-09T10:00:00Z"), pt("2026-07-09T10:00:15Z")] };
    const current = { a: [pt("2026-07-09T10:00:30Z")] };
    const merged = mergeStatsHistory(loaded, current, 2);
    expect(merged.a.map((p) => p.date)).toEqual([
      "2026-07-09T10:00:15Z",
      "2026-07-09T10:00:30Z",
    ]);
  });

  it("keeps names only present in one side", () => {
    const merged = mergeStatsHistory(
      { old: [pt("2026-07-09T10:00:00Z")] },
      { new: [pt("2026-07-09T12:00:00Z")] },
      100
    );
    expect(Object.keys(merged).sort()).toEqual(["new", "old"]);
  });

  it("tolerates null/garbage loaded data", () => {
    const current = { a: [pt("2026-07-09T12:00:00Z")] };
    expect(mergeStatsHistory(null, current, 10)).toEqual(current);
    expect(mergeStatsHistory("junk", current, 10)).toEqual(current);
  });
});

describe("makeGapDefined", () => {
  const getDate = (d) => new Date(d.date);

  it("breaks the path after a large gap, keeps normal cadence", () => {
    const series = [
      pt("2026-07-09T10:00:00Z"),
      pt("2026-07-09T10:00:15Z"),
      pt("2026-07-09T10:00:30Z"),
      pt("2026-07-09T14:00:00Z"), // app was closed ~4h
      pt("2026-07-09T14:00:15Z"),
    ];
    const defined = makeGapDefined(series, getDate);
    expect(defined(series[1], 1)).toBe(true);
    expect(defined(series[2], 2)).toBe(true);
    expect(defined(series[3], 3)).toBe(false); // gap point breaks the area
    expect(defined(series[4], 4)).toBe(true);
  });

  it("does not break coarser but regular sampling (e.g. Prometheus 5d steps)", () => {
    const base = new Date("2026-07-09T10:00:00Z").getTime();
    const series = Array.from({ length: 10 }, (_, i) =>
      pt(new Date(base + i * 24 * 60000).toISOString())
    );
    const defined = makeGapDefined(series, getDate);
    for (let i = 0; i < series.length; i++) {
      expect(defined(series[i], i)).toBe(true);
    }
  });

  it("treats tiny series as fully defined", () => {
    const defined = makeGapDefined([pt("2026-07-09T10:00:00Z")], getDate);
    expect(defined(null, 0)).toBe(true);
  });
});
