import pluginJs from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-var": "error",
      "no-use-before-define": ["error", { functions: false, classes: false, variables: true }],
      "no-undef": "error",
    },
  },
];
