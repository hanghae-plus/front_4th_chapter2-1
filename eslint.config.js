import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss';
import eslintPluginVitest from 'eslint-plugin-vitest';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**'],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.node,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
      tailwindcss: eslintPluginTailwindcss,
      vitest: eslintPluginVitest,
    },
    rules: {
      'prettier/prettier': 'error',
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginVitest.configs.recommended.rules,
      ...eslintPluginTailwindcss.configs.recommended.rules,
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-console': 'warn',
    },
  },
  eslintConfigPrettier,
];
