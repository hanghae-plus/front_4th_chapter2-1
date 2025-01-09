import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vitestPlugin from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 공통 설정
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser, // TypeScript 파서 추가
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // JavaScript 기본 설정
  pluginJs.configs.recommended,
  // React 설정
  {
    files: ['**/*.{jsx,tsx}'], // React 관련 파일만 적용
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules, // React 추천 규칙 가져오기
    },
  },
  // TypeScript 설정
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Prettier 설정
  {
    plugins: {
      prettier,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  }, // Vitest 설정
  {
    files: ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx}'], // 테스트 파일만 적용
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules, // Vitest 추천 규칙 가져오기
    },
    env: {
      'vitest/globals': true, // Vitest 글로벌 환경 추가
    },
  },
];
