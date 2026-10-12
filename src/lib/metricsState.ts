// Shared helpers for Krane's CPU/memory stat display.

// `kubectl top` failure messages meaning the metrics API has nothing to return
// yet — metrics-server still starting/scraping after a cluster (re)start, or
// its APIService not reachable — as opposed to the cluster itself being down
// (which Krane already shows as "cluster not found").
export function isMetricsUnavailableError(message: string = ""): boolean {
  return /metrics|unable to handle the request|ServiceUnavailable/i.test(
    message
  );
}

// True when a stat hasn't been populated: "", null/undefined, or a non-finite
// number. A real 0 (e.g. an idle pod at 0%) is NOT blank.
export function isBlankStat(value: any): boolean {
  if (value === "" || value === null || value === undefined) return true;
  return typeof value === "number" && !Number.isFinite(value);
}
