import type { TokenCredentials } from "./token-credentials.js";

export interface TokenRotationOutput {
  expiresAtSeconds: number;
  tokenValue: string;
}

export interface TokenRotationStrategy {
  rotate: (profile: string, credentials: TokenCredentials) => Promise<TokenRotationOutput>;
}
