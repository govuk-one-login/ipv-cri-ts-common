import { READ_EXPIRY_PAD_SECONDS } from "./token-expiry.js";

export const parseRefreshWindowSeconds = (raw: number | string): number => {
  const value = Number(raw);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Refresh window must be a positive number, got "${raw}"`);
  }

  if (value <= READ_EXPIRY_PAD_SECONDS) {
    throw new Error(`Refresh window must be greater than read expiry pad (${READ_EXPIRY_PAD_SECONDS} seconds)`);
  }

  return value;
};
