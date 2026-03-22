import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-path-traversal";

const tester = new RuleTester();

describe("no-path-traversal", () => {
  it("should detect path traversal vulnerabilities", () => {
    tester.run("no-path-traversal", rule, {
      valid: [
        // Static path
        `fs.readFile("/etc/config.json", "utf8", cb)`,
        // Variable (not concatenated/templated — lower risk, would need taint analysis)
        `fs.readFileSync(configPath, "utf8")`,
        // Non-fs function
        `something.readFile(userInput + "/file")`,
      ],
      invalid: [
        {
          code: `fs.readFile("/uploads/" + userInput, "utf8", cb)`,
          errors: [{ messageId: "pathTraversal" }],
        },
        {
          code: "fs.readFileSync(`/data/${req.params.file}`, \"utf8\")",
          errors: [{ messageId: "pathTraversal" }],
        },
        {
          code: `fs.writeFile("/tmp/" + filename, data, cb)`,
          errors: [{ messageId: "pathTraversal" }],
        },
        {
          code: "fs.createReadStream(`/files/${name}`)",
          errors: [{ messageId: "pathTraversal" }],
        },
      ],
    });
  });
});
