const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const nextPlugin = require("@next/eslint-plugin-next");
const { configs: nextConfigs } = require("@next/eslint-plugin-next");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
module.exports = [
  ...new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  }).extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ),
  nextConfigs["core-web-vitals"],
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
          ...js.configs.recommended.rules,
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
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/space-in-parens": "off",
      "@typescript-eslint/object-curly-spacing": "off",
      "@typescript-eslint/space-before-function-paren": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
];
