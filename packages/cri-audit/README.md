# `@govuk-one-login/cri-audit`

This package provides utilities for interacting with the audit event system in GOV.UK One Login's credential issuers
(CRIs).

Audit events are published by pushing to the audit event SQS queue deployed as part of the
[TxMA stack](https://github.com/govuk-one-login/ipv-cri-common-infrastructure/blob/main/txma/template.yaml).

For a reference on audit event properties, see the
[GOV.UK One Login event catalogue](https://event-catalogue.internal.account.gov.uk/attributes/).

Further information and source code can be found in the
[GitHub repository](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-audit).

## Usage

The following functions are exported:

| Function                   | Purpose                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| `buildAndSendAuditEvent()` | Combining the three below functions to construct and send an audit event in a single function call |
| `sendAuditEvent()`         | Sending a given audit event to SQS                                                                 |
| `buildBaseAuditEvent()`    | Constructing the base values required for all audit events, given the event name and component ID  |
| `buildAuditUser()`         | Constructing the `user` property of an audit event, given a `SessionItem`                          |

`buildAndSendAuditEvent()` is the recommended way of using this package, but the other functions are exported to allow
modification to the event, for cases where special fields need to be set outside of `extensions`, `restricted` or
`evidence` (eg, `user.phone`).

All functions are strongly typed, so should be fairly self-explanatory. Audit event types are also exported, so can be
used when constructing audit events.

The package is very small, so for implementation questions see the
[source code](https://github.com/govuk-one-login/ipv-cri-ts-common/blob/main/packages/cri-audit/src/index.ts).

## Module syntax

This module is currently built to both CJS and ESM standards, so should work universally. However, we expect be moving
to ESM-only in the near future.
