import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";
import eslintRecommended from "eslint/conf/eslint-recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
export default [
  ...new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
  }).extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals",
    "next/typescript"
  ),
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
          globalReturn: false,
          impliedStrict: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2015,
        ...globals.es2022,
      },
    },
    rules: {
      ...Object.fromEntries(
        Object.entries({
          ...eslintRecommended.rules,
          ...reactPlugin.configs.recommended.rules,
          ...reactHooksPlugin.configs.recommended.rules,
          ...nextPlugin.configs.recommended.rules,
          ...tsPlugin.configs.recommended.rules,
        }).map(([name, setting]) => {
          if (typeof setting === "string")
            return [name, setting === "error" ? "warn" : setting];
          if (!Array.isArray(setting)) return [name, setting];
          const [level, ...opts] = setting;
          return [name, [level === "error" ? "warn" : level, ...opts]];
        })
      ),
      "no-ternary": "off",
      "no-case-declarations": "off",
      "no-inline-comments": "off",
      "no-console": "off",
      "no-prototype-builtins": "off",
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      "prefer-template": "off",
      "spaced-comment": "off",
      "no-unused-vars": "off",
      "comma-dangle": "off",
      "space-in-parens": "off",
      "rest-spread-spacing": "off",
      "object-curly-spacing": "off",
      "array-bracket-newline": "off",
      "space-before-function-paren": "off",
      "no-restricted-globals": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
    },
  },
];
