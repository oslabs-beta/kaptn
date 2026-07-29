// Gap detection for the usage charts. The area path interpolates between
// consecutive points, so a stretch with no data (app closed between sessions)
// would render as a misleading straight "bridge". This produces a d3 `defined`
// accessor that breaks the path across gaps that are large relative to the
// series' own typical sampling interval — so it works for both the 15s
// kubectl-top cadence and coarser Prometheus steps without a hardcoded cutoff.
export function makeGapDefined(
  series: any[],
  getDate: (d: any) => Date
): (d: any, i: number) => boolean {
  if (!Array.isArray(series) || series.length < 3) return () => true;

  const deltas: number[] = [];
  for (let i = 1; i < series.length; i++) {
    deltas.push(getDate(series[i]).getTime() - getDate(series[i - 1]).getTime());
  }
  const sorted = [...deltas].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 15000;
  // 4x the typical interval (min 1 minute) counts as a hole, not jitter
  const threshold = Math.max(median * 4, 60000);

  return (_d: any, i: number) =>
    i === 0 ||
    getDate(series[i]).getTime() - getDate(series[i - 1]).getTime() <=
      threshold;
}
