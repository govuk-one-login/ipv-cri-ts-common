import type { TokenCredentials } from "./token-credentials.js";

export interface TokenRotationOutput {
  expiresAtSeconds: number;
  tokenValue: string;
}

export interface TokenRotationStrategy<TProfile extends string = string> {
  rotate: (profile: TProfile, credentials: TokenCredentials) => Promise<TokenRotationOutput>;
}
