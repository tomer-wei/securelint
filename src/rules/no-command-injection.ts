import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow dynamic strings in shell execution functions",
      recommended: true,
    },
    messages: {
      commandInjection:
        "Potential command injection: dynamic value passed to '{{name}}()'. Use execFile/spawn with argument arrays instead of exec with string commands.",
    },
    schema: [],
  },
  create(context) {
    const dangerousFunctions = new Set(["exec", "execSync"]);

    function isDynamic(node: any): boolean {
      if (node.type === "TemplateLiteral" && node.expressions.length > 0) return true;
      if (node.type === "BinaryExpression" && node.operator === "+") return true;
      return false;
    }

    return {
      CallExpression(node: any) {
        const callee = node.callee;

        // child_process.exec(...) or require('child_process').exec(...)
        if (
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          dangerousFunctions.has(callee.property.name)
        ) {
          const firstArg = node.arguments[0];
          if (firstArg && isDynamic(firstArg)) {
            context.report({
              node: firstArg,
              messageId: "commandInjection",
              data: { name: callee.property.name },
            });
          }
        }

        // Direct exec() / execSync() calls (after destructuring import)
        if (
          callee.type === "Identifier" &&
          dangerousFunctions.has(callee.name)
        ) {
          const firstArg = node.arguments[0];
          if (firstArg && isDynamic(firstArg)) {
            context.report({
              node: firstArg,
              messageId: "commandInjection",
              data: { name: callee.name },
            });
          }
        }
      },
    };
  },
};

export default rule;
