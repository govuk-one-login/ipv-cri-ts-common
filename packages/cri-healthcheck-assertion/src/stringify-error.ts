export function safeStringifyError(error: unknown): string {
  const errorType = error instanceof Error ? error.name : typeof error;

  if (process.env["LOG_FULL_ERRORS"] === "true") {
    return `${errorType} (${String(error)})`;
  }

  return errorType;
}