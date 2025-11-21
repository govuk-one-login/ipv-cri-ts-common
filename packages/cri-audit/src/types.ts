import {
  PersonIdentityDateOfBirth,
  PersonIdentityNamePart,
  UnixMillisecondsTimestamp,
  UnixSecondsTimestamp,
} from "@govuk-one-login/cri-types";

// NB: it's advised to only include properties that exist on the majority of CRI events in these types. CRI-specific fields
// should be extended from these interfaces in the relevant CRIs.
// Use https://event-catalogue.internal.account.gov.uk/attributes/ for reference.

/** Contains information about the user to whom the event refers */
export interface AuditUser {
  /** User's email address. Not used in most CRIs. https://event-catalogue.internal.account.gov.uk/attributes/user-email/ */
  email?: string;
  /**
   * A unique string that identifies a single journey through One Login.
   * https://event-catalogue.internal.account.gov.uk/attributes/user-govuk_signin_journey_id/
   */
  govuk_signin_journey_id: string;
  /** User's IP address. https://event-catalogue.internal.account.gov.uk/attributes/user-ip_address/ */
  ip_address?: string;
  /**
   * An identifier that persists on the user's device so may link multiple journeys.
   * https://event-catalogue.internal.account.gov.uk/attributes/user-persistent_session_id/
   */
  persistent_session_id?: string;
  /** User's phone number. Not used in most CRIs. https://event-catalogue.internal.account.gov.uk/attributes/user-phone/ */
  phone?: string;
  /**
   * Generated when a user is handed to the CRI and used to identify them during their CRI journey.
   * https://event-catalogue.internal.account.gov.uk/attributes/user-session_id/
   */
  session_id: string;
  /** Not used in most CRIs. https://event-catalogue.internal.account.gov.uk/attributes/user-transaction_id/ */
  transaction_id?: string;
  /** Internal 'common subject id' of the user. https://event-catalogue.internal.account.gov.uk/attributes/user-user_id/ */
  user_id: string;
}

export interface AuditRestricted {
  /**
   * Device fingerprint, retrieved from the request header. Only 'encoded' needs to be set - downstream event consumers
   * can decode the information from the base64.
   */
  device_information?: {
    /**
     * Base64-encoded device fingerprint.
     * https://event-catalogue.internal.account.gov.uk/attributes/restricted-device_information-encoded/
     */
    encoded: string;
  };
  /** User's birth date information. */
  birthDate?: PersonIdentityDateOfBirth[];
  /** User's name. */
  name?: {
    description?: string;
    validFrom?: number;
    validUntil?: number;
    nameParts: (PersonIdentityNamePart & { validFrom?: number; validUntil?: number })[];
  }[];
}

export interface BaseAuditEvent {
  /**
   * The component ID of the system component generating the event. Often a URL, with the same value as the 'iss' field
   * for a CRI's issued VC. https://event-catalogue.internal.account.gov.uk/attributes/component_id/
   */
  component_id: string;
  /**
   * The name of the event, including the prefix for the current CRI.
   * https://event-catalogue.internal.account.gov.uk/attributes/event_name/
   */
  event_name: string;
  /**
   * Timestamp of the event, in milliseconds.
   * https://event-catalogue.internal.account.gov.uk/attributes/event_timestamp_ms/
   */
  event_timestamp_ms: UnixMillisecondsTimestamp;
  /** Timestamp of the event, in seconds. */
  timestamp: UnixSecondsTimestamp;
}

export interface AuditEvent<ExtensionsType, EvidenceType = never, RestrictedType = AuditRestricted>
  extends BaseAuditEvent {
  user?: AuditUser;
  evidence?: EvidenceType;
  extensions?: ExtensionsType;
  restricted?: RestrictedType;
}
