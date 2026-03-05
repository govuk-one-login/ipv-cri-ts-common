# `@govuk-one-login/cri-cloudformation-helpers`

A utility package used to provide helper functions for retreiving stack outputs from AWS Cloudformation.

Further information, changelog and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-cloudformation-helpers).

## Usage

The following functions are exported:

| Function         | Purpose                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `stackOutputs()` | Queries the AWS Cloudformation stack by its name and returns the outputs associated to that stack. |

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
