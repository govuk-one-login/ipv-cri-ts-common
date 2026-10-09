import type { TokenEntity } from "./token-entity.js";

export interface TokenRepository<TProfile extends string = string> {
  getToken: (profile: TProfile) => Promise<TokenEntity | undefined>;
  putToken: (entity: TokenEntity) => Promise<void>;
}
