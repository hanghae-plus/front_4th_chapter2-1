import eslint from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'eslint.config.js'],

    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.browser,
      },
      sourceType: 'module',
    },
    plugins: {
      import: eslintPluginImport,
      prettier,
      promise,
      security,
      'simple-import-sort': simpleImportSort,
      sonarjs,
    },
    rules: {
      // JavaScript
      curly: ['warn', 'all'],
      eqeqeq: 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-implicit-coercion': 'error',
      'no-redeclare': 'warn',
      'no-shadow': 'off',
      'no-var': 'error',

      // Import
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
      'import/order': ['off'],
      'import/prefer-default-export': 'off',

      // promise 관련 추가 규칙
      'promise/always-return': 'error',

      'promise/no-return-wrap': 'error',

      'security/detect-non-literal-regexp': 'warn',
      // security 관련 규칙
      'security/detect-object-injection': 'warn',

      'simple-import-sort/exports': 'error',
      // simple-import-sort 규칙
      'simple-import-sort/imports': 'error',

      // sonarjs 중요 규칙들
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': 'warn',
    },
  },
];
