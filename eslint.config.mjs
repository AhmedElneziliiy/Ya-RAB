import globals from "globals";
import tseslint from "typescript-eslint";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      "unused-imports": pluginUnusedImports
    },
    rules: {
      "unused-imports/no-unused-imports": "warning",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
      ]
    },
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser
    }
  },
  tseslint.configs.recommended
]);
