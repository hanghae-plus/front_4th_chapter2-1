import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import tailwindcss from "eslint-plugin-tailwindcss";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

export default tseslint.config({
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tseslint.parser,
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.browser,
      React: "readonly",
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: "18.2",
      runtime: "automatic",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  plugins: {
    react: react,
    "react-hooks": reactHooks,
    "@typescript-eslint": typescriptPlugin,
    prettier: prettier,
    import: importPlugin,
    tailwindcss: tailwindcss,
  },
  rules: {
    // ESLint Core Rules
    ...js.configs.recommended.rules,
    "prefer-arrow-callback": "off",
    "arrow-body-style": "off",
    "no-unused-vars": "off",
    "no-console": "warn",
    eqeqeq: ["error", "always"],

    // eslint-plugin-react-hooks
    ...reactHooks.configs.recommended.rules,

    // eslint-plugin-react
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-target-blank": "off",

    // @typescript-eslint/eslint-plugin
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],

    // eslint-plugin-prettier
    "prettier/prettier": "error",

    // eslint-plugin-tailwindcss
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "off",
  },
});
