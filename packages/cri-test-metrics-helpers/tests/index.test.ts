import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { pollForMetrics } from "../src/index";

const metricName = "SomeMetric";
const metricQueryId = "someMetric";

const cloudWatchMock = mockClient(CloudWatchClient);

describe("pollForMetrics()", () => {
  beforeEach(() => {
    cloudWatchMock.resetHistory();
  });

  it("works properly in an expected case", async () => {
    cloudWatchMock
      .resolvesOnce({
        MetricDataResults: [{ Id: metricQueryId, Values: [0, 0, 0, 0, 0] }],
      })
      .resolvesOnce({
        MetricDataResults: [{ Id: metricQueryId, Values: [0, 0, 0, 0, 0, 0, 0] }],
      })
      .resolves({
        MetricDataResults: [
          {
            Id: metricQueryId,
            Values: [0, 0, 0, 1, 0, 0],
          },
        ],
      });

    const startTime = performance.now();

    const result = await pollForMetrics(
      [
        {
          queryId: metricQueryId,
          namespace: "blahblah",
          metricName: metricName,
          dimensions: { service: "someService" },
          unit: "Count",
        },
      ],
      3,
      0.1,
    );

    const endTime = performance.now();
    const elapsedTimeMs = endTime - startTime;

    expect(result).toEqual({
      [metricQueryId]: 1,
    });

    expect(cloudWatchMock.calls()).toHaveLength(3);

    expect(elapsedTimeMs).toBeGreaterThan(190);
    expect(elapsedTimeMs).toBeLessThan(250);
  });

  it("throws an error when it times out", async () => {
    cloudWatchMock.resolves({
      MetricDataResults: [{ Id: metricQueryId, Values: [0, 0, 0, 0, 0] }],
    });

    const startTime = performance.now();

    await expect(
      async () =>
        await pollForMetrics(
          [
            {
              queryId: metricQueryId,
              namespace: "blahblah",
              metricName: metricName,
              dimensions: { service: "someService" },
              unit: "Count",
            },
          ],
          0.3,
          0.1,
        ),
    ).rejects.toThrow(`Timed out`);

    const endTime = performance.now();
    const elapsedTimeMs = endTime - startTime;

    expect(elapsedTimeMs).toBeGreaterThan(290);
    expect(elapsedTimeMs).toBeLessThan(400);
  });

  it("bubbles up any errors thrown by the CloudWatch client", async () => {
    cloudWatchMock.rejects(new Error("broken!"));

    await expect(
      async () =>
        await pollForMetrics(
          [
            {
              queryId: metricQueryId,
              namespace: "blahblah",
              metricName: metricName,
              dimensions: { service: "someService" },
              unit: "Count",
            },
          ],
          1,
          0.1,
        ),
    ).rejects.toThrow(`broken!`);
  });
});
