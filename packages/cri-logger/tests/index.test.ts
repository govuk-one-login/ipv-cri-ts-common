import { describe, expect, it } from "vitest";
import { logger } from "../src/index.js";

describe("index.ts", () => {
  it("exports a logger", () => {
    expect(logger).toBeDefined();
  });

  it.each(["info", "debug", "warn", "error", "critical"] as const)("%s function exists", (name) => {
    expect(logger[name]).toBeDefined();
    expect(typeof logger[name]).toEqual("function");
  });
});
