import { LambdaInterface } from "@aws-lambda-powertools/commons/types";
import { captureLatency, captureMetric, metrics, MetricUnit } from "../../../src/index";

class TestFunction implements LambdaInterface {
  @metrics.logMetrics({ captureColdStartMetric: true })
  public async handler() {
    captureMetric("Metric1");

    captureMetric("Metric2", 5, MetricUnit.Gigabytes);

    await captureLatency("Latency", () => new Promise((resolve) => setTimeout(resolve, 1500)));
  }
}

const functionInstance = new TestFunction();
export const handler = functionInstance.handler.bind(functionInstance);
