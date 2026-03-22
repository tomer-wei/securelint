import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow string concatenation or template literals in SQL query functions",
      recommended: true,
    },
    messages: {
      sqlInjection:
        "Potential SQL injection: avoid using {{type}} in SQL queries. Use parameterized queries instead.",
    },
    schema: [],
  },
  create(context) {
    const sqlFunctionNames = new Set([
      "query",
      "execute",
      "exec",
      "raw",
      "rawQuery",
      "prepare",
    ]);

    const sqlKeywordPattern =
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|UNION|FROM|WHERE)\b/i;

    function isSqlString(node: Rule.Node): boolean {
      if (node.type === "Literal" && typeof (node as any).value === "string") {
        return sqlKeywordPattern.test((node as any).value);
      }
      if (node.type === "TemplateLiteral") {
        const quasis = (node as any).quasis as any[];
        return quasis.some((q: any) => sqlKeywordPattern.test(q.value.raw));
      }
      return false;
    }

    function checkCallExpression(node: any) {
      const callee = node.callee;
      let funcName: string | null = null;

      if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
        funcName = callee.property.name;
      } else if (callee.type === "Identifier") {
        funcName = callee.name;
      }

      if (!funcName || !sqlFunctionNames.has(funcName)) return;

      for (const arg of node.arguments) {
        if (arg.type === "BinaryExpression" && arg.operator === "+") {
          if (containsSqlString(arg) && containsNonLiteral(arg)) {
            context.report({
              node: arg,
              messageId: "sqlInjection",
              data: { type: "string concatenation" },
            });
          }
        }

        if (arg.type === "TemplateLiteral" && arg.expressions.length > 0) {
          if (isSqlString(arg)) {
            context.report({
              node: arg,
              messageId: "sqlInjection",
              data: { type: "template literal interpolation" },
            });
          }
        }
      }
    }

    function containsSqlString(node: any): boolean {
      if (node.type === "Literal" && typeof node.value === "string") {
        return sqlKeywordPattern.test(node.value);
      }
      if (node.type === "TemplateLiteral") {
        return isSqlString(node);
      }
      if (node.type === "BinaryExpression") {
        return containsSqlString(node.left) || containsSqlString(node.right);
      }
      return false;
    }

    function containsNonLiteral(node: any): boolean {
      if (node.type === "Literal") return false;
      if (node.type === "BinaryExpression") {
        return containsNonLiteral(node.left) || containsNonLiteral(node.right);
      }
      return true;
    }

    return {
      CallExpression: checkCallExpression,
    };
  },
};

export default rule;
