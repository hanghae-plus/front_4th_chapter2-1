const globals = require("globals");
const pluginJs = require("@eslint/js");
const eslintConfigPrettier = require("eslint-config-prettier");
const eslintPluginPrettier = require("eslint-plugin-prettier/recommended");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  eslintConfigPrettier,
  {
    rules: {
      "react/prop-types": "off", // PropTypes 사용 안 함
      "prettier/prettier": "error", // Prettier 규칙 강제 적용
    },
    settings: {
      react: {
        version: "detect", // React 버전 자동 감지
      },
    },
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".cache/",
      "*.lock",
      "README.md",
      ".github/",
      "main.original.js",
    ],
  },
];
