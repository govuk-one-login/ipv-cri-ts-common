import { MetricUnit } from "@aws-lambda-powertools/metrics";
import { MetricUnit as MetricUnitType } from "@aws-lambda-powertools/metrics/types";
import { metrics } from "./metricsClient.js";

const HTTP_METRIC_DIMENSION = "HTTP";
const RESPONSE_LATENCY_METRIC = "ResponseLatency";

export function captureMetric(name: string, value = 1, unit: MetricUnitType = MetricUnit.Count) {
  metrics.addMetric(name, unit, value);
}

export function captureMetricWithDimensions(
  name: string,
  dimensions: Record<string, string>,
  value = 1,
  unit: MetricUnitType = MetricUnit.Count,
) {
  const m = metrics.singleMetric();
  for (const [k, v] of Object.entries(dimensions)) m.addDimension(k, v);
  m.addMetric(name, unit, value);
}

export async function captureLatency<T>(
  name: string,
  callback: () => Promise<T>,
): Promise<{ result: T; latencyInMs: number }> {
  const latencyMetric = metrics.singleMetric();

  const start = performance.now();

  const result = await callback();

  const latencyInMs = Math.floor(performance.now() - start);

  latencyMetric.addDimension(HTTP_METRIC_DIMENSION, name);
  latencyMetric.addMetric(RESPONSE_LATENCY_METRIC, MetricUnit.Milliseconds, latencyInMs);

  return { result, latencyInMs };
}

export { MetricUnit } from "@aws-lambda-powertools/metrics";
export { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
export { metrics } from "./metricsClient.js";
