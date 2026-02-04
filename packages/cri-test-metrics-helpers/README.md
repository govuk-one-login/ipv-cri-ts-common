# `@govuk-one-login/cri-test-metrics-helpers`

This package provides functionality which can be used to retrieve metrics from AWS CloudWatch. It is intended for use in
integration testing.

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-test-metrics-helpers).

## Usage

The following functions are exported:

| Function           | Purpose                                                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pollForMetrics()` | Polls AWS CloudWatch Metrics for metrics matching a particular namespace, metric name and dimension(s). It will poll until all values are greater than zero, and then return the values it retrieved. |

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
