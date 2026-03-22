import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-eval";

const tester = new RuleTester();

describe("no-eval", () => {
  it("should detect dangerous eval-like usage", () => {
    tester.run("no-eval", rule, {
      valid: [
        // Normal function calls
        `setTimeout(function() {}, 1000)`,
        `setTimeout(() => {}, 1000)`,
        `setInterval(doSomething, 5000)`,
        // Non-eval identifiers
        `evaluate(something)`,
      ],
      invalid: [
        {
          code: `eval("alert(1)")`,
          errors: [{ messageId: "noEval" }],
        },
        {
          code: `eval(userInput)`,
          errors: [{ messageId: "noEval" }],
        },
        {
          code: `new Function("return " + userInput)`,
          errors: [{ messageId: "noEval" }],
        },
        {
          code: `setTimeout("alert(1)", 1000)`,
          errors: [{ messageId: "noEval" }],
        },
        {
          code: `setInterval("doEvil()", 5000)`,
          errors: [{ messageId: "noEval" }],
        },
      ],
    });
  });
});
