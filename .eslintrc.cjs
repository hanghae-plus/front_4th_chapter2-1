module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  plugins: ['import', 'prettier', 'promise', 'security', 'simple-import-sort', 'sonarjs'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  globals: {
    cartStore: 'writable',
    productStore: 'writable',
  },
  rules: {
    // JavaScript 규칙
    curly: ['warn', 'all'],
    eqeqeq: 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-unused-vars': 'off',
    'prefer-const': 'warn',
    'no-implicit-coercion': 'error',
    'no-redeclare': 'warn',
    'no-shadow': 'off',
    'no-var': 'error',

    // Import 규칙
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'import/order': ['off'],
    'import/prefer-default-export': 'off',

    // promise 관련 추가 규칙
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',

    // security 관련 규칙
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-object-injection': 'warn',

    // simple-import-sort 규칙
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',

    // sonarjs 규칙
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': 'warn',
  },
  overrides: [
    // JavaScript 파일 설정
    {
      files: ['src/basic/**/*.js'],
      parser: 'espree',
    },
    // TypeScript 파일 설정
    {
      files: ['src/advanced/**/*.ts', 'src/advanced/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended'
      ],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
        '@typescript-eslint/explicit-module-boundary-types': ['warn'],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-expressions': 'warn',
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.eslintrc.js'
  ],
};