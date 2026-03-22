import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow use of eval(), Function(), setTimeout/setInterval with strings",
      recommended: true,
    },
    messages: {
      noEval:
        "Security risk: {{name}}() can execute arbitrary code. {{suggestion}}",
    },
    schema: [],
  },
  create(context) {
    function checkCallExpression(node: any) {
      const callee = node.callee;

      // eval()
      if (callee.type === "Identifier" && callee.name === "eval") {
        context.report({
          node,
          messageId: "noEval",
          data: {
            name: "eval",
            suggestion: "Avoid eval and find a safer alternative.",
          },
        });
        return;
      }

      // new Function()
      if (
        node.type === "NewExpression" &&
        callee.type === "Identifier" &&
        callee.name === "Function"
      ) {
        context.report({
          node,
          messageId: "noEval",
          data: {
            name: "Function",
            suggestion: "Avoid the Function constructor for dynamic code execution.",
          },
        });
        return;
      }

      // setTimeout("string", ...) / setInterval("string", ...)
      if (
        callee.type === "Identifier" &&
        (callee.name === "setTimeout" || callee.name === "setInterval")
      ) {
        const firstArg = node.arguments[0];
        if (
          firstArg &&
          (firstArg.type === "Literal" && typeof firstArg.value === "string" ||
           firstArg.type === "TemplateLiteral")
        ) {
          context.report({
            node,
            messageId: "noEval",
            data: {
              name: callee.name,
              suggestion: "Pass a function reference instead of a string.",
            },
          });
        }
      }
    }

    return {
      CallExpression: checkCallExpression,
      NewExpression: checkCallExpression,
    };
  },
};

export default rule;
