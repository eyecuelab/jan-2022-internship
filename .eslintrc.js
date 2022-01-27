module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "eslint-plugin-import",
    "eslint-plugin-react",
    "react-hooks",
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    ".eslintrc.js",
    "node_modules/",
    "coverage/",
    "dist/",
    "build/",
    "remix.config.js",
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-floating-promises": 2, // 2 === "error"
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      `error`,
      {
        prefer: `type-imports`,
      },
    ],
  },
};
