import { UnixSecondsTimestamp } from "./brands.js";

export interface PersonIdentitySocialSecurityRecord {
  personalNumber: string;
}

export interface PersonIdentityNamePart {
  type: string;
  value: string;
}

/** See https://github.com/govuk-one-login/architecture/blob/main/rfc/0011-identity-representation.md#4-names */
export interface PersonIdentityName {
  nameParts: PersonIdentityNamePart[];
}

/** See https://github.com/govuk-one-login/architecture/blob/main/rfc/0020-address-structure.md */
export interface PersonIdentityAddress {
  uprn?: number;
  organisationName?: string;
  departmentName?: string;
  subBuildingName?: string;
  buildingNumber?: string;
  buildingName?: string;
  dependentStreetName?: string;
  streetName?: string;
  doubleDependentAddressLocality?: string;
  dependentAddressLocality?: string;
  addressLocality?: string;
  postalCode?: string;
  addressCountry?: string;
  validFrom?: string;
  validUntil?: string;
}

/** See https://github.com/govuk-one-login/architecture/blob/main/rfc/0011-identity-representation.md#5-date-of-birth */
export interface PersonIdentityDateOfBirth {
  value: string;
}

/** See https://github.com/govuk-one-login/architecture/blob/main/rfc/0024-identity-vc-for-checks.md#credential-subject-properties */
export interface PersonIdentityItem {
  sessionId: string;
  addresses?: PersonIdentityAddress[];
  names?: PersonIdentityName[];
  birthDates?: PersonIdentityDateOfBirth[];
  socialSecurityRecord?: PersonIdentitySocialSecurityRecord[];
  expiryDate: UnixSecondsTimestamp;
}
