import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettiereslint from "eslint-config-prettier/flat";
import globals from "globals";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  prettiereslint, // disables ESLint rules that might conflict with prettier
  {
    files: ["**/src/**/*", "**/test/**/*"], // only apply to source code & unit tests
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
      globals: globals.node,
    },
  },
);
