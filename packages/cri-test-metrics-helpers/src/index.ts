import { MetricUnit } from "@aws-lambda-powertools/metrics/types";
import { CloudWatchClient, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";
import { logger } from "@govuk-one-login/cri-logger";

export interface MetricsInputItem<QueryId extends string> {
  queryId: QueryId;
  metricName: string;
  namespace: string;
  dimensions: Record<string, string>;
  unit: MetricUnit;
}

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function requestMetricsOnce<QueryId extends string>(
  client: CloudWatchClient,
  command: GetMetricDataCommand,
  queryIds: QueryId[],
) {
  logger.info(`Requesting ${queryIds.length} metrics...`);

  const queryRes = await client.send(command);

  const processedResult: [string, number][] = (queryRes.MetricDataResults ?? []).map((v) => [
    v.Id ?? "",
    v.Values?.reduce((a, b) => a + b, 0) ?? 0,
  ]);

  const hasAllKeys =
    processedResult.length === queryIds.length &&
    queryIds.every((id) => processedResult.some(([resultId]) => resultId === id));

  const allValuesOverZero = processedResult.every((v) => v[1] > 0);

  const isValid = hasAllKeys && allValuesOverZero;

  if (isValid) {
    const result = Object.fromEntries(processedResult) as Record<QueryId, number>;

    logger.info(`Metrics resolved: ${JSON.stringify(result)}`);

    return { result, isValid };
  } else {
    logger.info(`Not all metrics have resolved.`);
    return { isValid };
  }
}

export async function pollForMetrics<QueryId extends string>(
  metrics: MetricsInputItem<QueryId>[],
  timeoutSeconds = 600,
  pollIntervalSeconds = 10,
) {
  const cloudwatchClient = new CloudWatchClient();

  const tenMinutesAgo = new Date((Math.floor(Date.now() / 60000) - 10) * 60000);
  const endOfCurrentMinute = new Date(Math.ceil(Date.now() / 60000) * 60000);

  const getMetricsCommand = new GetMetricDataCommand({
    StartTime: tenMinutesAgo,
    EndTime: endOfCurrentMinute,
    MetricDataQueries: metrics.map((m) => ({
      Id: m.queryId,
      MetricStat: {
        Period: 60,
        Stat: "Sum",
        Unit: m.unit,
        Metric: {
          Namespace: m.namespace,
          MetricName: m.metricName,
          Dimensions: Object.entries(m.dimensions).map(([key, value]) => ({ Name: key, Value: value })),
        },
      },
    })),
  });

  const queryIds = metrics.map((m) => m.queryId);

  const stopTime = Date.now() + timeoutSeconds * 1000;

  let metricsResult = await requestMetricsOnce(cloudwatchClient, getMetricsCommand, queryIds);

  while (!metricsResult.isValid && Date.now() < stopTime) {
    await wait(pollIntervalSeconds);
    metricsResult = await requestMetricsOnce(cloudwatchClient, getMetricsCommand, queryIds);
  }

  if (!metricsResult.isValid)
    throw new Error(`Timed out while waiting for metrics: "${metrics.map((m) => m.metricName).join('", "')}"`);

  return metricsResult.result;
}
