import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";
import eslintRecommended from "eslint/conf/eslint-recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
export default [
  ...new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
  }).extends("next/core-web-vitals", "next/typescript"),
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
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    rules: Object.fromEntries(
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
  },
];
