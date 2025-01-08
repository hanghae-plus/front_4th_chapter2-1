module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react-refresh", "@typescript-eslint", "react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // Airbnb 스타일 예외 규칙들
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/prefer-default-export": "off",
  },
};
