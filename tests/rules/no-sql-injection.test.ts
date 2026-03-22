import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-sql-injection";

const tester = new RuleTester();

describe("no-sql-injection", () => {
  it("should detect SQL injection vulnerabilities", () => {
    tester.run("no-sql-injection", rule, {
      valid: [
        // Parameterized query
        `db.query("SELECT * FROM users WHERE id = ?", [userId])`,
        // No SQL keywords
        `db.query(someVariable)`,
        // Static string (no concatenation)
        `db.query("SELECT * FROM users")`,
        // Non-SQL function with concatenation
        `console.log("hello " + name)`,
      ],
      invalid: [
        {
          code: `db.query("SELECT * FROM users WHERE id = " + userId)`,
          errors: [{ messageId: "sqlInjection" }],
        },
        {
          code: "db.query(`SELECT * FROM users WHERE id = ${userId}`)",
          errors: [{ messageId: "sqlInjection" }],
        },
        {
          code: `connection.execute("DELETE FROM users WHERE id = " + req.params.id)`,
          errors: [{ messageId: "sqlInjection" }],
        },
        {
          code: "pool.query(`UPDATE users SET name = ${name} WHERE id = ${id}`)",
          errors: [{ messageId: "sqlInjection" }],
        },
      ],
    });
  });
});
