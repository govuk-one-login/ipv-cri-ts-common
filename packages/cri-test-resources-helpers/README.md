# `@govuk-one-login/cri-test-resources-helpers`

A resources package used to provide helper functions for the integration tests against the `test-resources` stack.

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-test-resources-helpers).

## Usage

The following functions are exported:

| Function                     | Purpose                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `pollForTestHarnessEvents()` | Invokes the `TEST_HARNESS_EXECUTE_API` to retrieve the events that were sent to the SQS queue and then processed by the the dequeue lambda. |

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
