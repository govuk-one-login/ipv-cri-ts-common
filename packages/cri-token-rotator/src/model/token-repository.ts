import type { TokenEntity } from "./token-entity.js";

export interface TokenRepository {
  getToken: (profile: string) => Promise<TokenEntity | undefined>;
  putToken: (entity: TokenEntity) => Promise<void>;
}
