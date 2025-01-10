module.exports = {
  rules: {
    'no-undef': 'error',
  },
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: ['eslint:recommended', 'prettier'],
};
