import { safeStringifyError } from "./stringify-error.js";

export type AssertFunctionResultOutput<ResultType = unknown> = {
  latency: number;
  result: ResultType | undefined;
  error: string | undefined;
};

export type HealthcheckMode = "healthcheck" | "report";

export type HealthcheckValidationResult =
  | { success: true }
  | { success: false; message: string };

export async function assertFunctionResultWithTimeout<ResultType>(
  mode: HealthcheckMode,
  timeoutMs: number,
  callback: (abortSignal: AbortSignal) => Promise<ResultType>,
  checkFunction?: (
    result: ResultType | undefined
  ) => HealthcheckValidationResult
): Promise<AssertFunctionResultOutput<ResultType>> {
  let result: ResultType | undefined;
  let error: string | undefined;

  const abortController = new AbortController();

  const start = performance.now();

  try {
    result = await Promise.race([
      callback(abortController.signal),
      timeout(abortController.signal, timeoutMs),
    ]);

    if (checkFunction) {
      const checkOutcome = checkFunction(result);

      if (!checkOutcome.success) {
        throw new Error(checkOutcome.message);
      }
    }
  } catch (e) {
    if (mode === "healthcheck") {
      throw e;
    }

    error = safeStringifyError(e);
  } finally {
    abortController.abort();
  }

  const latency = Math.round(performance.now() - start);

  return {
    result,
    latency,
    error,
  };
}

function timeout(
  abortSignal: AbortSignal,
  timeoutMs: number
): Promise<undefined> {
  return new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out after ${timeoutMs} ms!`));
    }, timeoutMs);

    abortSignal.addEventListener("abort", () =>
      clearTimeout(timeoutId)
    );

    if (abortSignal.aborted) {
      clearTimeout(timeoutId);
    }
  });
}