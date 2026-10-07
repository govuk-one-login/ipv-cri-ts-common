import { describe, expect, it } from "vitest";
import { parseRefreshWindowSeconds } from "../../src/util/parse-refresh-window.js";
import { READ_EXPIRY_PAD_SECONDS } from "../../src/util/token-expiry.js";

describe("parseRefreshWindowSeconds", () => {
  it("accepts a number greater than the read expiry pad", () => {
    expect(parseRefreshWindowSeconds(300)).toBe(300);
  });

  it("parses a string greater than the read expiry pad", () => {
    expect(parseRefreshWindowSeconds("300")).toBe(300);
  });

  it("rejects a non-numeric value", () => {
    expect(() => parseRefreshWindowSeconds("not-a-number")).toThrow(
      'Refresh window must be a positive number, got "not-a-number"',
    );
  });

  it("rejects zero", () => {
    expect(() => parseRefreshWindowSeconds("0")).toThrow('Refresh window must be a positive number, got "0"');
  });

  it("rejects a negative value", () => {
    expect(() => parseRefreshWindowSeconds(-10)).toThrow('Refresh window must be a positive number, got "-10"');
  });

  it("rejects a value equal to the read expiry pad", () => {
    expect(() => parseRefreshWindowSeconds(READ_EXPIRY_PAD_SECONDS)).toThrow(
      "Refresh window must be greater than read expiry pad (30 seconds)",
    );
  });

  it("rejects a value below the read expiry pad", () => {
    expect(() => parseRefreshWindowSeconds(READ_EXPIRY_PAD_SECONDS - 1)).toThrow(
      "Refresh window must be greater than read expiry pad (30 seconds)",
    );
  });
});
