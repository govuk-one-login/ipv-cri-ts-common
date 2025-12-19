import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["integration-tests/**/*.test.ts"],
    passWithNoTests: true,
    env: {
      POWERTOOLS_LOG_LEVEL: "INFO",
    },
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
