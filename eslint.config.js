import globals from "globals";
import jsPlugin from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config} */
export default [
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
      react: reactPlugin,
    },
    rules: {
      ...jsPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "no-console": "error",
      "no-unused-vars": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto", // LF/CRLF 문제 해결
        },
      ],
    },
  },
];
