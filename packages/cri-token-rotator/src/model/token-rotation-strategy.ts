import type { TokenCredentials } from "./token-credentials.js";

export interface TokenRotationOutput {
  expiresAtSeconds: number;
  tokenValue: string;
}

export interface TokenRotationStrategy {
  rotate: (credentials: TokenCredentials) => Promise<TokenRotationOutput>;
}
