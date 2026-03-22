import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow unsafe DOM manipulation that can lead to XSS",
      recommended: true,
    },
    messages: {
      noInnerHtml:
        "Potential XSS: assigning to '{{property}}' with dynamic content is unsafe. Use textContent or a sanitization library.",
      noDangerouslySetInnerHTML:
        "Potential XSS: 'dangerouslySetInnerHTML' bypasses React's XSS protection. Sanitize input with a library like DOMPurify.",
      noDocumentWrite:
        "Potential XSS: 'document.write()' with dynamic content is unsafe.",
    },
    schema: [],
  },
  create(context) {
    return {
      AssignmentExpression(node: any) {
        const left = node.left;
        if (left.type !== "MemberExpression" || left.property.type !== "Identifier") return;

        const prop = left.property.name;
        if (prop === "innerHTML" || prop === "outerHTML") {
          const right = node.right;
          // Only flag if assigned value is not a static string
          if (right.type !== "Literal") {
            context.report({
              node,
              messageId: "noInnerHtml",
              data: { property: prop },
            });
          }
        }
      },

      JSXAttribute(node: any) {
        if (
          node.name &&
          node.name.type === "JSXIdentifier" &&
          node.name.name === "dangerouslySetInnerHTML"
        ) {
          context.report({
            node,
            messageId: "noDangerouslySetInnerHTML",
          });
        }
      },

      CallExpression(node: any) {
        const callee = node.callee;
        // document.write() / document.writeln()
        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "Identifier" &&
          callee.object.name === "document" &&
          callee.property.type === "Identifier" &&
          (callee.property.name === "write" || callee.property.name === "writeln")
        ) {
          const firstArg = node.arguments[0];
          if (firstArg && firstArg.type !== "Literal") {
            context.report({
              node,
              messageId: "noDocumentWrite",
            });
          }
        }
      },
    };
  },
};

export default rule;
