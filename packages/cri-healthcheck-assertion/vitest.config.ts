import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    env: {
      POWERTOOLS_LOG_LEVEL: "SILENT",
    },
    coverage: {
      reporter: ["text", "lcov"],
    },
    exclude: [...configDefaults.exclude, "integration-tests"],
  },
});
