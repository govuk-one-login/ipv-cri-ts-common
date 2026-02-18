# `@govuk-one-login/cri-error-response`

This is a lightweight package that standardises API error response formatting and provides safe-by-default structured
logging of the error.

It does not replace error handling within Lambdas. Instead, it focuses on consistent response formatting, allowing our
Lambdas to handle errors internally and throw a `CriError` from anywhere in the execution flow, which will then be
converted into a standardised API response.

We intentionally provide a single `CriError` instead of many custom error types to keep the library lightweight and
clearly signal expected failures with an explicit HTTP status code and safe client-facing message.

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-error-response).

## Usage

The following functions are exported:

| Function                | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `formatErrorResponse()` | Format errors for API responses and log them safely |

## Example

```ts
import { formatErrorResponse, CriError } from "@govuk-one-login/error-response";

export class MyCriHandler implements LambdaInterface {
  public async handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
      // business logic
      if (!sessionId) {
        throw new CriError(400, "No session-id header present");
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success" }),
      };
    } catch (err) {
      return formatErrorResponse(err);
    }
  }
}
```

### Behaviour

- `CriError` with status < 500 → returns the provided message.
- `CriError` with status ≥ 500 → returns `"Internal server error"`.
- Unknown errors → always return `500 Internal server error`.
- Logs are redacted by default.

### Logging

Logging of unknown errors is redacted by default, as we do not know if these errors contain PII for example. To log
these in lower environments, set `LOG_FULL_ERRORS` to true in the lambda env vars.

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
