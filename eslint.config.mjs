import eslint from "@eslint/js";
import prettiereslint from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  prettiereslint, // disables ESLint rules that might conflict with prettier
  {
    files: ["**/src/**/*"], // only apply to source code
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
      globals: globals.node,
    },
  },
  {
    files: ["**/tests/**/*"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
