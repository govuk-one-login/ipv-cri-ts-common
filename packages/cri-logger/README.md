# `@govuk-one-login/cri-logger`

This package initialises and exports an instance of the AWS Lambda Powertools logger. For more information on the
logger, see [their documentation](https://www.npmjs.com/package/@aws-lambda-powertools/logger).

The logger is imported by other `@govuk-one-login/cri-[suffix]` utility modules, so this package is recommended as it
allows us to create a single shared instance of the logger for CRI runtimes. This means that information saved to the
logger's context in your consuming code (such as the journey ID and Lambda cold start state) will appear in logs inside
common CRI modules too.

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-logger).

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
