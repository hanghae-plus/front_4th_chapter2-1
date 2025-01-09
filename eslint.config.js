import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: "@typescript-eslint/parser", // TypeScript 파서 설정
      parserOptions: {
        ecmaVersion: 2020, // 최신 ECMAScript 버전 사용
        sourceType: "module", // 모듈 시스템 사용
        ecmaFeatures: {
          jsx: true, // JSX 문법 사용
        },
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": pluginTypeScript,
    },
    extends: [
      "plugin:@typescript-eslint/recommended", // TypeScript 권장 규칙 적용
    ],
  },
];
