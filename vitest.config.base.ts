import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["../../vitest-setup.ts"],
    passWithNoTests: true,
    env: {
      POWERTOOLS_LOG_LEVEL: "SILENT",
    },
  },
});
