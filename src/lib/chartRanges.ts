// Time ranges offered in the chart controls dropdown. 7d stays under
// Prometheus's default 10-day retention in the kube-prometheus-stack chart.
export interface ChartRange {
  label: string;
  seconds: number;
}

export const CHART_RANGES: ChartRange[] = [
  { label: "15m", seconds: 15 * 60 },
  { label: "1h", seconds: 60 * 60 },
  { label: "6h", seconds: 6 * 60 * 60 },
  { label: "24h", seconds: 24 * 60 * 60 },
  { label: "2d", seconds: 2 * 24 * 60 * 60 },
  { label: "5d", seconds: 5 * 24 * 60 * 60 },
  { label: "7d", seconds: 7 * 24 * 60 * 60 },
];
