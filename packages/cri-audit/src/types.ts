import {
  PersonIdentityDateOfBirth,
  PersonIdentityNamePart,
  UnixMillisecondsTimestamp,
  UnixSecondsTimestamp,
} from "@govuk-one-login/cri-types";

// NB: it's advised to only include properties that exist on the majority of CRI events in these types. CRI-specific fields
// should be extended from these interfaces in the relevant CRIs.
// Use https://event-catalogue.internal.account.gov.uk/attributes/ for reference.

export interface AuditUser {
  email?: string;
  govuk_signin_journey_id: string;
  ip_address?: string;
  persistent_session_id?: string;
  phone?: string;
  session_id: string;
  transaction_id?: string;
  user_id: string;
}

export interface AuditRestricted {
  device_information?: {
    encoded: string;
  };
  birthDate?: PersonIdentityDateOfBirth[];
  name?: {
    description?: string;
    validFrom?: number;
    validUntil?: number;
    nameParts: (PersonIdentityNamePart & { validFrom?: number; validUntil?: number })[];
  }[];
}

export interface BaseAuditEvent {
  component_id: string;
  event_name: string;
  event_timestamp_ms: UnixMillisecondsTimestamp;
  timestamp: UnixSecondsTimestamp;
}

/** See the One Login event catalogue for reference: https://event-catalogue.internal.account.gov.uk/attributes/ */
export interface AuditEvent<ExtensionsType = never, EvidenceType = never, RestrictedType = AuditRestricted>
  extends BaseAuditEvent {
  user?: AuditUser;
  evidence?: EvidenceType;
  extensions?: ExtensionsType;
  restricted?: RestrictedType;
}
