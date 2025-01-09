import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  },
];
