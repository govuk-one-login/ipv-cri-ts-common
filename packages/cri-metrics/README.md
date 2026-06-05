# `@govuk-one-login/cri-metrics`

This package exports a number of basic utilities for use when publishing AWS CloudWatch metrics in GOV.UK One Login's
credential issuers (CRIs).

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-metrics).

## Usage

> [!WARNING]
>
> Metrics are not sent to CloudWatch immediately. They are collected in memory and only 'flushed' to CloudWatch as a
> batch when explicitly instructed to do so.
>
> It is recommended to either use the `@metrics.logMetrics()` class decorator on your Lambda handler, or to call the
> `metrics.publishStoredMetrics()` function at the end of the handler.
>
> It is also necessary to manually request that cold start metrics are recorded - this can be done automatically by
> passing `{ captureColdStartMetric: true }` to the class decorator.
>
> For more information, see the
> [documentation](https://docs.aws.amazon.com/powertools/typescript/latest/features/metrics/) for the underlying
> `@aws-lambda-powertools/metrics` module.

The following functions are exported:

| Utility                         | Purpose                                                                                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `captureMetric()`               | Captures a metric with a given name, and optional value and unit. NB: Metrics captured this way must be flushed at the end of the Lambda execution.                        |
| `captureMetricWithDimensions()` | Captures a metric with a given name, dimensions, and optional value and unit. The metric is a `singleMetric` and is therefore flushed straight away.                       |
| `captureLatency()`              | Executes a callback, measures the time taken and publishes a metric with the response time. The latency metric is a `singleMetric` and is therefore flushed straight away. |
| `metrics`                       | The underlying Lambda Powertools instance. Use this to configure the underlying Powertools module, most importantly by configuring the flushing of metrics.                |

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
