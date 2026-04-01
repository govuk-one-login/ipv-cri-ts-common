import eslint from "@eslint/js";
import prettiereslint from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      ".nx/**/*",
      "eslint.config.mjs",
      "**/coverage/**/*",
      "**/dist/**/*",
      "**/.aws-sam/**/*",
      "**/vitest.config.ts",
    ],
  },
  {
    files: ["**/*.{js,cjs,mjs,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslint.configs.recommended,
  {
    files: ["**/*.ts"], // only apply to source code
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "**/tests/**/*", "**/integration-tests/**/*"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettiereslint, // disables ESLint rules that might conflict with prettier
);
