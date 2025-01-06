export default {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    eqeqeq: 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    camelcase: 'warn',
  },
};
