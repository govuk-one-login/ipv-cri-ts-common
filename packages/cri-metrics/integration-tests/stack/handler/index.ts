import { LambdaInterface } from "@aws-lambda-powertools/commons/types";
import { captureLatency, captureMetric, captureMetricWithDimensions, metrics, MetricUnit } from "../../../src/index";

class TestFunction implements LambdaInterface {
  @metrics.logMetrics({ captureColdStartMetric: true })
  public async handler() {
    captureMetric("Metric1");

    captureMetric("Metric2", 5, MetricUnit.Gigabytes);

    captureMetricWithDimensions("Metric3", { Region: "eu-west-2", Strategy: "UAT" }, 7, MetricUnit.Megabytes);

    await captureLatency("Latency", () => new Promise((resolve) => setTimeout(resolve, 1500)));
  }
}

const functionInstance = new TestFunction();
export const handler = functionInstance.handler.bind(functionInstance);
