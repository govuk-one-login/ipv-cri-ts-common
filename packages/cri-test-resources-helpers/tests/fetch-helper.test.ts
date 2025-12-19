import { it } from "node:test";
import { describe, expect } from "vitest";
import { signedFetch } from "../src/fetch-helper";

describe("signedFetch()", () => {
  it("exports a signedFetch() function", () => {
    expect(signedFetch).toBeDefined();
    expect(typeof signedFetch).toEqual("function");
  });
});
