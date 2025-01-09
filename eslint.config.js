import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // TypeScript 관련 설정
  {
    files: ["**/*.{ts,tsx}"],  // TypeScript 파일만 적용
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
  
  // TypeScript 권장 규칙
  {
    files: ["**/*.ts", "**/*.tsx"],  // TypeScript 파일만 적용
    plugins: {
      "@typescript-eslint": pluginTypeScript,
    },
    extends: [
      "plugin:@typescript-eslint/recommended", // TypeScript 권장 규칙 적용
    ],
  },

  // 기본 JavaScript 추천 규칙 (여기서는 .ts와 .tsx 제외)
  pluginJs.configs.recommended,

  // React 규칙 (TypeScript 파일에서만 적용)
  pluginReact.configs.flat.recommended,

  // .js 파일을 ESLint 검사에서 제외하기 위해 추가
  {
    files: ["**/*.js"],  // .js 파일에 대해 아무 규칙도 적용하지 않음
    rules: {
      // .js 파일에 대해 ESLint 규칙을 비활성화
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];
