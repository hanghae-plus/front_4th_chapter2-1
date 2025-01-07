import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    extends: ["plugin:import/recommended", "plugin:react/recommended"],
    plugins: ["prettier"],
    rules: {
      "no-console": "error",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto", // LF/CRLF 문제 해결
        },
      ],
    },
  },
];
