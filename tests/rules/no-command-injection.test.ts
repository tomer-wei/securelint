import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-command-injection";

const tester = new RuleTester();

describe("no-command-injection", () => {
  it("should detect command injection vulnerabilities", () => {
    tester.run("no-command-injection", rule, {
      valid: [
        // Static command string
        `exec("ls -la", callback)`,
        // execFile with array args is safe
        `execFile("ls", ["-la"], callback)`,
        // spawn is safe by design
        `spawn("ls", ["-la"])`,
        // Non-exec function with dynamic string
        `something.run("cmd " + userInput)`,
      ],
      invalid: [
        {
          code: `exec("rm -rf " + userInput, callback)`,
          errors: [{ messageId: "commandInjection" }],
        },
        {
          code: "child.exec(`ls ${directory}`, callback)",
          errors: [{ messageId: "commandInjection" }],
        },
        {
          code: "execSync(`cat ${filename}`)",
          errors: [{ messageId: "commandInjection" }],
        },
        {
          code: `child_process.execSync("echo " + message)`,
          errors: [{ messageId: "commandInjection" }],
        },
      ],
    });
  });
});
