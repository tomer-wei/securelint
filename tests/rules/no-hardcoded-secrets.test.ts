import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-hardcoded-secrets";

const tester = new RuleTester();

describe("no-hardcoded-secrets", () => {
  it("should detect hardcoded secrets", () => {
    tester.run("no-hardcoded-secrets", rule, {
      valid: [
        // Environment variables
        `const apiKey = process.env.API_KEY`,
        // Short/placeholder values
        `const password = "changeme"`,
        `const apiKey = "test1234"`,
        // Non-secret variables
        `const username = "admin"`,
        `const count = 42`,
      ],
      invalid: [
        {
          code: `const api_key = "sk-1234567890abcdef1234567890abcdef"`,
          errors: [{ messageId: "hardcodedSecret" }],
        },
        {
          code: `const password = "supersecretpassword123"`,
          errors: [{ messageId: "hardcodedSecret" }],
        },
        {
          code: `const auth_token = "eyJhbGciOiJIUzI1NiJ9.longtoken"`,
          errors: [{ messageId: "hardcodedSecret" }],
        },
        {
          code: `const config = { client_secret: "a]verySecretValue1234" }`,
          errors: [{ messageId: "hardcodedSecret" }],
        },
        {
          // AWS access key pattern
          code: `const key = "AKIAIOSFODNN7EXAMPLE"`,
          errors: [{ messageId: "hardcodedSecret" }],
        },
        {
          // GitHub PAT pattern
          code: `const token = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij"`,
          errors: [{ messageId: "hardcodedSecret" }],
        },
      ],
    });
  });
});
