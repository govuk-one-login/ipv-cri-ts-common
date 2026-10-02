import type { TokenRepository } from "../model/token-repository.js";

import { logger } from "@govuk-one-login/cri-logger";
import { formatTokenExpiry, isTokenExpiredForRead } from "../util/token-expiry.js";

export interface TokenRetrievalService<TProfile extends string> {
  retrieveToken: (profile: TProfile) => Promise<string | undefined>;
}

interface TokenRetrievalServiceCollaborators {
  tokenRepository: TokenRepository;
}

export const createTokenRetrievalService = <TProfile extends string>(
  collaborators: TokenRetrievalServiceCollaborators,
): TokenRetrievalService<TProfile> => ({
  retrieveToken: async (profile) => {
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
