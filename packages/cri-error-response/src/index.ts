import { logger } from "@govuk-one-login/cri-logger";
import { CriError } from "./cri-error.js";

export { CriError } from "./cri-error.js";

const DEFAULT_HEADERS = { "Content-Type": "application/json" };

export function formatErrorResponse(err: unknown) {
  if (err instanceof CriError) {
    logger.error(`CriError: ${err.message}`, { statusCode: err.statusCode, internalCode: err.internalCode });

    const clientMessage = err.statusCode >= 500 ? "Internal server error" : err.message;

    return {
      statusCode: err.statusCode,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ message: clientMessage }),
    };
  }

  logUnhandledError(err);
  return {
    statusCode: 500,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ message: "Internal server error" }),
  };
}

function logUnhandledError(error: unknown): void {
  const LOG_FULL_ERRORS = process.env["LOG_FULL_ERRORS"] === "true";

  if (error instanceof Error) {
    logger.error(`Unhandled Error: ${error.name}`, {
      errorMessage: LOG_FULL_ERRORS ? error.message : "redacted",
      stack: LOG_FULL_ERRORS ? error.stack : "redacted",
    });
  } else {
    logger.error("Unhandled Error: Non Error type thrown", {
      type: typeof error,
    });
  }
}
