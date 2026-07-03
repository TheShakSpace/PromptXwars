import { type StatData } from "../types";

export const statsData: StatData[] = [
  {
    id: "throughput",
    label: "Kernel Throughput",
    value: "2,845 req/m",
    change: "+12.4%",
    isPositive: true,
    metricType: "integer",
  },
  {
    id: "latency",
    label: "Core API Latency",
    value: "42ms",
    change: "-18.2%",
    isPositive: true, // latency dropping is positive!
    metricType: "time",
  },
  {
    id: "sync-shards",
    label: "Cloud Shards Synced",
    value: "99.99%",
    change: "stable",
    isPositive: true,
    metricType: "percentage",
  },
  {
    id: "token-ratio",
    label: "Semantic Compression Ratio",
    value: "4.8x",
    change: "+40.2%",
    isPositive: true,
    metricType: "integer",
  },
];
