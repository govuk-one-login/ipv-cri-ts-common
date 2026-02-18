import { logger } from "@govuk-one-login/cri-logger";
import { CriError } from "./cri-error.js";

export { CriError } from "./cri-error.js";

const DEFAULT_HEADERS = { "Content-Type": "application/json" };

export function formatErrorResponse(err: unknown) {
  if (err instanceof CriError) {
    logger.error("CriError", { message: err.message, statusCode: err.statusCode, internalCode: err.internalCode });

    const clientMessage = err.statusCode >= 500 ? "Internal server error" : err.message;

    return {
      statusCode: err.statusCode,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ message: clientMessage }),
    };
  }

  logger.error("Unhandled Error", safeSerializeError(err));
  return {
    statusCode: 500,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ message: "Internal server error" }),
  };
}

function safeSerializeError(error: unknown) {
  const LOG_FULL_ERRORS = process.env["LOG_FULL_ERRORS"] === "true";
  if (error instanceof Error) {
    return {
      name: error.name,
      message: LOG_FULL_ERRORS ? error.message : "redacted",
      stack: LOG_FULL_ERRORS ? error.stack : "redacted",
    };
  }

  return {
    message: "Non Error type thrown",
    type: typeof error,
  };
}
