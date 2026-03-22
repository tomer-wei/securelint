import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-xss";

const tester = new RuleTester();

describe("no-xss", () => {
  it("should detect XSS vulnerabilities", () => {
    tester.run("no-xss", rule, {
      valid: [
        // Static string assignment to innerHTML
        `element.innerHTML = "<b>safe</b>"`,
        // textContent is safe
        `element.textContent = userInput`,
        // document.write with static string
        `document.write("hello")`,
      ],
      invalid: [
        {
          code: `element.innerHTML = userInput`,
          errors: [{ messageId: "noInnerHtml" }],
        },
        {
          code: `element.outerHTML = "<div>" + userInput + "</div>"`,
          errors: [{ messageId: "noInnerHtml" }],
        },
        {
          code: `document.write(userInput)`,
          errors: [{ messageId: "noDocumentWrite" }],
        },
        {
          code: `document.writeln(htmlContent)`,
          errors: [{ messageId: "noDocumentWrite" }],
        },
      ],
    });
  });
});
