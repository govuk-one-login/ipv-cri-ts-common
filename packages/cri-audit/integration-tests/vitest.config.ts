import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["integration-tests/**/*.test.ts"],
    passWithNoTests: true,
    env: {
      POWERTOOLS_LOG_LEVEL: "SILENT",
    },
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
