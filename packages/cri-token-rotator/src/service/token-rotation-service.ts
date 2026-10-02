import { TokenCredentials, TokenCredentialsProvider } from "../model/token-credentials.js";
import type { TokenRepository } from "../model/token-repository.js";
import type { TokenRotationStrategy } from "../model/token-rotation-strategy.js";

import { logger } from "@govuk-one-login/cri-logger";
import { AggregateRotationError, type RotationFailure } from "../error/token-rotation-errors.js";
import { parseRefreshWindowSeconds } from "../util/parse-refresh-window.js";
import { formatTokenExpiry, isTokenDueForRotation } from "../util/token-expiry.js";

export interface TokenRotationService {
  rotateAll: (options?: { force: boolean }) => Promise<void>;
}

export interface TokenRotationServiceConfig<TProfile extends string> {
  profiles: TProfile[];
  refreshWindowSeconds: number | string;
}

interface TokenRotationServiceCollaborators<TProfile extends string> {
  credentialsProvider: TokenCredentialsProvider<TProfile>;
  tokenRepository: TokenRepository;
  tokenRotationStrategy: TokenRotationStrategy;
}

export const createTokenRotationService = <TProfile extends string>(
  config: TokenRotationServiceConfig<TProfile>,
  collaborators: TokenRotationServiceCollaborators<TProfile>,
): TokenRotationService => {
  const refreshWindowSeconds = parseRefreshWindowSeconds(config.refreshWindowSeconds);

  const doRotate = async (profile: TProfile, credentials: TokenCredentials): Promise<void> => {
    const { expiresAtSeconds, tokenValue } = await collaborators.tokenRotationStrategy.rotate(credentials);
    await collaborators.tokenRepository.putToken({
      id: profile,
      tokenValue,
      ttl: expiresAtSeconds,
    });
    logger.info("Token rotated", { expiresAt: formatTokenExpiry(expiresAtSeconds), profile });
  };

  const rotateForProfile = async (profile: TProfile, force: boolean): Promise<void> => {
    if (!force) {
      const currentToken = await collaborators.tokenRepository.getToken(profile);
      if (currentToken && !isTokenDueForRotation(currentToken, refreshWindowSeconds)) {
        logger.info("Token still fresh, skipping rotation", { profile });
        return;
      }
    }
    const credentials = await collaborators.credentialsProvider.getCredentials(profile);
    await doRotate(profile, credentials);
  };

  return {
    rotateAll: async (options) => {
      const force = options?.force ?? false;
      const results = await Promise.allSettled(config.profiles.map((profile) => rotateForProfile(profile, force)));

      const failures: RotationFailure[] = results.flatMap((result, index) => {
        if (result.status === "fulfilled") return [];
        const profile = config.profiles[index]!;
        const reason = result.reason instanceof Error ? result.reason.message : "Unknown error";
        logger.error("Token rotation failed", { profile, reason });
        return [{ profile, reason }];
      });

      if (failures.length > 0) throw new AggregateRotationError(failures);
    },
  };
};
