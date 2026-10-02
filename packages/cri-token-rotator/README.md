# `@govuk-one-login/cri-token-rotator`

This package's purpose is to enable a consumer to easily do the following:

- Request access tokens from a third party API
- Store those tokens in a database
- Automatically rotate tokens when they are nearing expiry
- Retrieve tokens for use in other systems
- Assign tokens to profiles to enable test data strategy

> [!WARNING]
>
> This package is in a pre-release state and its interface may change without warning. Once it's ready for release, this
> block should be removed and a `feat!` commit message used to create a major version bump.

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-token-rotator).

## Usage

The following functions are exported:

| Function                        | Purpose                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- |
| `createTokenRotationService()`  | Rotating tokens, skipping any profile whose cached token is still fresh |
| `createTokenRetrievalService()` | Returning a profile's cached token for use elsewhere                    |
| `createDynamoTokenRepository()` | Building a `TokenRepository` backed by a DynamoDB table                 |

Consumers will need to implement the exported `TokenCredentialsProvider` and `TokenRotationStrategy` interfaces and pass
them in to `createTokenRotationService`.

See a working example for more inspiration:
https://github.com/govuk-one-login/ipv-cri-ob-api/tree/main/src/ecospend-token

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
