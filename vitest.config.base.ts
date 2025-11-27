import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    env: {
      POWERTOOLS_LOG_LEVEL: "SILENT",
    },
  },
});
