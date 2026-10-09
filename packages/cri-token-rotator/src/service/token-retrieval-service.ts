import type { TokenRepository } from "../model/token-repository.js";

import { logger } from "@govuk-one-login/cri-logger";
import { formatTokenExpiry, isTokenExpiredForRead } from "../util/token-expiry.js";

export interface TokenRetrievalService<TProfile extends string> {
  retrieveToken: (profile: TProfile) => Promise<string | undefined>;
}

export interface TokenRetrievalServiceConfig<TProfile extends string> {
  profiles: readonly TProfile[];
}

interface TokenRetrievalServiceCollaborators<TProfile extends string> {
  tokenRepository: TokenRepository<NoInfer<TProfile>>;
}

export const createTokenRetrievalService = <TProfile extends string>(
  config: TokenRetrievalServiceConfig<TProfile>,
  collaborators: TokenRetrievalServiceCollaborators<TProfile>,
): TokenRetrievalService<TProfile> => ({
  retrieveToken: async (profile) => {
    if (!config.profiles.includes(profile)) {
      logger.warn("Unknown profile requested", { profile });
      return undefined;
    }
    const tokenEntity = await collaborators.tokenRepository.getToken(profile);
    if (!tokenEntity) {
      logger.warn("No cached token found", { profile });
      return undefined;
    }
    if (isTokenExpiredForRead(tokenEntity)) {
      logger.warn("Cached token has expired", {
        expiredAt: formatTokenExpiry(tokenEntity.ttl),
        profile,
      });
      return undefined;
    }
    return tokenEntity.tokenValue;
  },
});
