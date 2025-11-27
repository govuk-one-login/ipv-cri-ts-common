import { UnixMillisecondsTimestamp, UnixSecondsTimestamp } from "./brands.js";

export interface EvidenceRequest {
  scoringPolicy?: string;
  strengthScore?: number;
  validityScore?: number;
  verificationScore?: number;
  activityHistoryScore?: number;
  identityFraudScore?: number;
}

export interface SessionItem {
  sessionId: string;
  attemptCount: number;
  clientId: string;
  clientSessionId: string;
  createdDate: UnixMillisecondsTimestamp;
  expiryDate: UnixSecondsTimestamp;
  redirectUri: string;
  state: string;
  subject: string;
  authorizationCode?: string;
  authorizationCodeExpiryDate?: UnixSecondsTimestamp;
  accessToken?: string;
  accessTokenExpiryDate?: UnixSecondsTimestamp;
  clientIpAddress?: string;
  persistentSessionId?: string;
  txn?: string;
  evidenceRequest?: EvidenceRequest;
  context?: string;
}
