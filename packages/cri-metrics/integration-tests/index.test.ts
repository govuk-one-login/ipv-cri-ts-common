import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { pollForMetrics } from "@govuk-one-login/cri-test-metrics-helpers";
import { describe, expect, it } from "vitest";

describe("Invoke function & check metrics", { timeout: 300_000 }, () => {
  it("invokes the function and receives the expected metrics", async () => {
    const functionName = `${process.env.STACK_NAME}-TestFn`;
    const serviceName = `${process.env.STACK_NAME}-TestFunction-${process.env.RUN_ID}`;

    const lambdaClient = new LambdaClient();
    const invokeCommand = new InvokeCommand({
      FunctionName: functionName,
    });
    const invokeRes = await lambdaClient.send(invokeCommand);
    expect(invokeRes.StatusCode).toEqual(200);
    expect(invokeRes.FunctionError).toBe(undefined);

    const result = await pollForMetrics([
      {
        queryId: "coldStart",
        namespace: "TSCommon-Metrics-IntegrationTests",
        metricName: "ColdStart",
        dimensions: {
          service: serviceName,
          function_name: functionName,
        },
        unit: "Count",
      },
      {
        queryId: "metric1",
        namespace: "TSCommon-Metrics-IntegrationTests",
        metricName: "Metric1",
        dimensions: {
          service: serviceName,
        },
        unit: "Count",
      },
      {
        queryId: "metric2",
        namespace: "TSCommon-Metrics-IntegrationTests",
        metricName: "Metric2",
        dimensions: { service: serviceName },
        unit: "Gigabytes",
      },
      {
        queryId: "metric3",
        namespace: "TSCommon-Metrics-IntegrationTests",
        metricName: "Metric3",
        dimensions: {
          service: serviceName,
          Region: "eu-west-2",
          Strategy: "UAT",
        },
        unit: "Megabytes",
      },
      {
        queryId: "responseLatency",
        namespace: "TSCommon-Metrics-IntegrationTests",
        metricName: "ResponseLatency",
        dimensions: {
          service: serviceName,
          HTTP: "Latency",
        },
        unit: "Milliseconds",
      },
    ]);

    expect(result.coldStart).toBeGreaterThanOrEqual(1);
    expect(result.metric1).toBeGreaterThanOrEqual(1);
    expect(result.metric2).toBeGreaterThanOrEqual(5);
    expect(result.metric3).toBeGreaterThanOrEqual(7);
    expect(result.responseLatency).toBeGreaterThan(1400);
  });
});
