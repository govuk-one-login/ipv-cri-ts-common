# `@govuk-one-login/cri-token-rotator`

This package's purpose is to enable a consumer to easily do the following:

- Request access tokens from a third party API
- Store those tokens in a database
- Automatically rotate tokens when they are nearing expiry
- Retrieve tokens for use in other systems
- Assign tokens to profiles to enable test data strategy

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-token-rotator).

## Usage

The following functions are exported:

| Function                        | Purpose                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- |
| `createTokenRotationService()`  | Rotating tokens, skipping any profile whose cached token is still fresh |
| `createTokenRetrievalService()` | Returning a profile's cached token for use elsewhere                    |

Consumers will need to implement the exported `TokenCredentialsProvider`, `TokenRotationStrategy` and `TokenRepository`
(if not using the provided Dynamo token repository) interfaces and pass them in to `createTokenRotationService`.

### DynamoDB token repository

`cri-token-rotator` is does not require a specific database but a Dynamo backed token repository is provided separately
as a convenience.

```ts
import { createDynamoTokenRepository } from "@govuk-one-login/cri-token-rotator/dynamodb";
```

This requires the optional peer dependency `@aws-sdk/lib-dynamodb`. Consumers bringing their own `TokenRepository` can
ignore this.

See a working example for more inspiration:
https://github.com/govuk-one-login/ipv-cri-ob-api/tree/main/src/ecospend-token

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect to be
moving to ESM-only in the near future.
