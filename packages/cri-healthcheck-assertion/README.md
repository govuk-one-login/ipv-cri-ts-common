# `@govuk-one-login/cri-healthcheck-assertion`

This package provides utilities for implementing health checks within CRIs.

It allows health check functions to be executed with:

- configurable timeout handling
- latency measurement
- result validation
- mode-dependent error handling

The package supports two modes:

| Mode          | Behaviour                                                  |
| ------------- | ---------------------------------------------------------- |
| `healthcheck` | Any failure causes an error to be thrown immediately       |
| `report`      | Failures are captured and returned as part of the response |

This enables CRIs to provide both:

- simple pass/fail health checks
- detailed diagnostic health check reports

Further information and source code can be found in the GitHub repository.

## Usage

The following exports are available:

| Export                              | Purpose                                            |
| ----------------------------------- | -------------------------------------------------- |
| `assertFunctionResultWithTimeout()` | Execute a health check with timeout and validation |
| `HealthcheckMode`                   | Supported operating modes                          |
| `HealthcheckValidationResult`       | Validation callback result type                    |
| `AssertFunctionResultOutput`        | Standard response object                           |

## Basic Example

```ts
import { assertFunctionResultWithTimeout } from "@govuk-one-login/cri-healthcheck-assertion";

const result = await assertFunctionResultWithTimeout("report", 5000, async () => {
  return fetchDependency();
});

console.log(result);
```

## Validation Example

```ts
const result = await assertFunctionResultWithTimeout(
  "report",
  5000,
  async () => ({
    status: 200,
  }),
  (response) =>
    response?.status === 200
      ? { success: true }
      : {
          success: false,
          message: "Dependency returned unexpected status",
        },
);
```

## Healthcheck Mode

In `healthcheck` mode, errors are re-thrown immediately.

```ts
await assertFunctionResultWithTimeout("healthcheck", 5000, async () => {
  throw new Error("Dependency unavailable");
});
```

The above example throws an error.

## Report Mode

In `report` mode, errors are captured in the response.

```ts
const result = await assertFunctionResultWithTimeout("report", 5000, async () => {
  throw new Error("Dependency unavailable");
});

console.log(result.error);
```

Example output:

```ts
{
  result: undefined,
  latency: 42,
  error: "Dependency unavailable"
}
```

## Return Type

```ts
type AssertFunctionResultOutput<ResultType> = {
  latency: number;
  result: ResultType | undefined;
  error: string | undefined;
};
```

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect to move to
ESM-only in the future.
