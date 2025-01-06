import globals from 'globals';
import pluginJs from '@eslint/js';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser }, rules: {
      'no-unused-vars': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
      'no-multiple-empty-lines': ['error', { 'max': 2 }],
      'curly': 'error',
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true, 'avoidEscape': true }],
    }
  },
  pluginJs.configs.recommended,
];