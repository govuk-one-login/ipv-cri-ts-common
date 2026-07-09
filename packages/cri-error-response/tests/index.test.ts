import { logger } from "@govuk-one-login/cri-logger";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CriError } from "../src/cri-error.js";
import { formatErrorResponse } from "../src/index.js";

vi.mock("@govuk-one-login/cri-logger", () => {
  return {
    logger: {
      error: vi.fn(),
    },
  };
});

describe("formatErrorResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns CriError statusCode and message when status <500", () => {
    const err = new CriError(400, "Bad request");

    const response = formatErrorResponse(err);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('{"message":"Bad request"}');
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("returns CriError statusCode and Internal server error message when status 500", () => {
    const err = new CriError(500, "Configutation Error");

    const response = formatErrorResponse(err);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('{"message":"Internal server error"}');
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("returns CriError and Internal server error message when status >500", () => {
    const err = new CriError(503, "Configutation Error");

    const response = formatErrorResponse(err);

    expect(response.statusCode).toBe(503);
    expect(response.body).toBe('{"message":"Internal server error"}');
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("logs CriError message, statusCode and default internalCode when status <500", () => {
    const err = new CriError(400, "Bad request");

    formatErrorResponse(err);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith("CriError: Bad request", {
      statusCode: 400,
      internalCode: "CRI_ERROR",
    });
  });

  it("logs CriError message, statusCode and custom internalCode when status <500", () => {
    const err = new CriError(400, "Bad request", "JWT_VERIFICATION_FAILED");

    formatErrorResponse(err);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith("CriError: Bad request", {
      statusCode: 400,
      internalCode: "JWT_VERIFICATION_FAILED",
    });
  });

  it("logs CriError message, statusCode and default internalCode when status >=500", () => {
    const err = new CriError(500, "Runtime Error");

    formatErrorResponse(err);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith("CriError: Runtime Error", {
      statusCode: 500,
      internalCode: "CRI_ERROR",
    });
  });

  it("logs CriError message, statusCode and custom internalCode when status >=500", () => {
    const err = new CriError(503, "Runtime Error", "RUNTIME_ERROR");

    formatErrorResponse(err);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith("CriError: Runtime Error", {
      statusCode: 503,
      internalCode: "RUNTIME_ERROR",
    });
  });

  it("returns 500 and redacts logs on Unhandled Error", () => {
    const err = new Error("Unhandled");
    const response = formatErrorResponse(err);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('{"message":"Internal server error"}');
    expect(response.headers).toEqual({ "Content-Type": "application/json" });

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith("Unhandled Error: Error", {
      errorMessage: "redacted",
      stack: "redacted",
    });
  });

  it("returns 500 and logs type only on null object", () => {
    const response = formatErrorResponse(null);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('{"message":"Internal server error"}');
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
    expect(logger.error).toHaveBeenCalledWith("Unhandled Error: Non Error type thrown", {
      type: "object",
    });
  });

  it("returns 500 and logs type only on string object", () => {
    const response = formatErrorResponse("Some PII");
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('{"message":"Internal server error"}');
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
    expect(logger.error).toHaveBeenCalledWith("Unhandled Error: Non Error type thrown", {
      type: "string",
    });
  });

  it("returns 500 and logs full error details when LOG_FULL_ERRORS true", () => {
    process.env["LOG_FULL_ERRORS"] = "true";
    const err = new Error("Unhandled");
    const response = formatErrorResponse(err);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('{"message":"Internal server error"}');
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
    expect(logger.error).toHaveBeenCalledWith("Unhandled Error: Error", {
      errorMessage: "Unhandled",
      stack: expect.stringMatching(/^Error: Unhandled\n\s+at /),
    });
  });
});
