import js from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: ['dist'],
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  eslintPluginPrettier,
  eslintConfigPrettier,
];
