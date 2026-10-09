import type { TokenEntity, TokenRepository } from "../../src";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTokenRetrievalService } from "../../src";

const NOW_SECONDS = 690_768_000; // 1991-11-22T00:00:00Z
const FRESH_TOKEN_TTL = NOW_SECONDS + 1000;
const EXPIRED_TOKEN_TTL = NOW_SECONDS - 60;
const PROFILE = "EXAMPLE";
const CONFIG = { profiles: [PROFILE] };

const buildTokenEntity = (overrides: Partial<TokenEntity> = {}): TokenEntity => ({
  id: PROFILE,
  tokenValue: "cached-token",
  ttl: FRESH_TOKEN_TTL,
  ...overrides,
});

const mockTokenRepository = (): TokenRepository => ({
  getToken: vi.fn().mockResolvedValue(undefined),
  putToken: vi.fn().mockResolvedValue(undefined),
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(NOW_SECONDS * 1000));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("token-retrieval-service", () => {
  describe("retrieveToken", () => {
    it("returns the cached token value when fresh", async () => {
      const tokenRepository = mockTokenRepository();
      tokenRepository.getToken = vi.fn().mockResolvedValue(buildTokenEntity());

      const service = createTokenRetrievalService(CONFIG, { tokenRepository });
      const token = await service.retrieveToken(PROFILE);

      expect(token).toBe("cached-token");
      expect(tokenRepository.getToken).toHaveBeenCalledWith(PROFILE);
    });

    it("returns undefined when no token is cached for the profile", async () => {
      const service = createTokenRetrievalService(CONFIG, { tokenRepository: mockTokenRepository() });

      const token = await service.retrieveToken(PROFILE);

      expect(token).toBeUndefined();
    });

    it("returns undefined when the cached token has expired", async () => {
      const tokenRepository = mockTokenRepository();
      tokenRepository.getToken = vi.fn().mockResolvedValue(buildTokenEntity({ ttl: EXPIRED_TOKEN_TTL }));

      const service = createTokenRetrievalService(CONFIG, { tokenRepository });
      const token = await service.retrieveToken(PROFILE);

      expect(token).toBeUndefined();
    });

    it("returns undefined for an unconfigured profile", async () => {
      const tokenRepository = mockTokenRepository();
      const service = createTokenRetrievalService(CONFIG, { tokenRepository });

      const token = await service.retrieveToken("UNKNOWN");

      expect(token).toBeUndefined();
      expect(tokenRepository.getToken).not.toHaveBeenCalled();
    });
  });
});
