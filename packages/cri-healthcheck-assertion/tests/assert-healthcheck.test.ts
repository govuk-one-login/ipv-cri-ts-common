import { describe, expect, it } from "vitest";
import { assertFunctionResultWithTimeout } from "../src/assert-healthcheck";

describe("assertFunctionResultWithTimeout", () => {
  it("returns result and latency when callback succeeds", async () => {
    const result = await assertFunctionResultWithTimeout("report", 5000, async () => "success");

    expect(result.result).toBe("success");
    expect(result.error).toBeUndefined();
    expect(result.latency).toBeGreaterThanOrEqual(0);
  });

  it("throws when callback fails in healthcheck mode", async () => {
    await expect(
      assertFunctionResultWithTimeout("healthcheck", 5000, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });

  it("captures callback errors in report mode", async () => {
    const result = await assertFunctionResultWithTimeout("report", 5000, async () => {
      throw new Error("boom");
    });

    expect(result.result).toBeUndefined();
    expect(result.error).toContain("boom");
  });

  it("returns result when validation succeeds", async () => {
    const result = await assertFunctionResultWithTimeout(
      "report",
      5000,
      async () => ({ status: 200 }),
      (response) => (response?.status === 200 ? { success: true } : { success: false, message: "invalid status" }),
    );

    expect(result.result).toEqual({ status: 200 });
    expect(result.error).toBeUndefined();
  });

  it("throws when validation fails in healthcheck mode", async () => {
    await expect(
      assertFunctionResultWithTimeout(
        "healthcheck",
        5000,
        async () => ({ status: 500 }),
        () => ({
          success: false,
          message: "validation failed",
        }),
      ),
    ).rejects.toThrow("validation failed");
  });

  it("captures validation errors in report mode", async () => {
    const result = await assertFunctionResultWithTimeout(
      "report",
      5000,
      async () => ({ status: 500 }),
      () => ({
        success: false,
        message: "validation failed",
      }),
    );

    expect(result.result).toEqual({ status: 500 });
    expect(result.error).toContain("validation failed");
  });

  it("returns timeout error in report mode", async () => {
    const result = await assertFunctionResultWithTimeout("report", 1, async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return "success";
    });

    expect(result.result).toBeUndefined();
    expect(result.error).toContain("Timed out");
  });

  it("throws timeout error in healthcheck mode", async () => {
    await expect(
      assertFunctionResultWithTimeout("healthcheck", 1, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "success";
      }),
    ).rejects.toThrow("Timed out");
  });

  it("supports validation functions that inspect returned values", async () => {
    const result = await assertFunctionResultWithTimeout(
      "report",
      5000,
      async () => ({
        httpStatus: 401,
      }),
      (response) =>
        response?.httpStatus === 401
          ? { success: true }
          : {
              success: false,
              message: "unexpected status",
            },
    );

    expect(result.error).toBeUndefined();
    expect(result.result).toEqual({
      httpStatus: 401,
    });
  });
});
