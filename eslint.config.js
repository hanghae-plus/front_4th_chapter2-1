import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['src/main.original.js', 'src/basic/**/__tests__/**', 'src/advanced/**/__tests__/**'],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  prettierConfig,
];
