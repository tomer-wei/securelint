export const recommended = {
  plugins: ["securelint"],
  rules: {
    "securelint/no-sql-injection": "warn",
    "securelint/no-eval": "error",
    "securelint/no-hardcoded-secrets": "warn",
    "securelint/no-xss": "error",
    "securelint/no-path-traversal": "warn",
    "securelint/no-command-injection": "error",
  },
};
