import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow unsanitized user input in file system path operations",
      recommended: true,
    },
    messages: {
      pathTraversal:
        "Potential path traversal: dynamic value used in '{{name}}()' without validation. Sanitize the path or use path.resolve() with a base directory check.",
    },
    schema: [],
  },
  create(context) {
    const fsFunctions = new Set([
      "readFile",
      "readFileSync",
      "writeFile",
      "writeFileSync",
      "readdir",
      "readdirSync",
      "unlink",
      "unlinkSync",
      "rmdir",
      "rmdirSync",
      "mkdir",
      "mkdirSync",
      "stat",
      "statSync",
      "access",
      "accessSync",
      "appendFile",
      "appendFileSync",
      "createReadStream",
      "createWriteStream",
    ]);

    function isDynamic(node: any): boolean {
      if (node.type === "TemplateLiteral" && node.expressions.length > 0) return true;
      if (node.type === "BinaryExpression" && node.operator === "+") return true;
      if (node.type === "CallExpression") return true;
      return false;
    }

    return {
      CallExpression(node: any) {
        const callee = node.callee;

        // fs.readFile(...), fs.writeFile(...), etc.
        if (
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          fsFunctions.has(callee.property.name)
        ) {
          const firstArg = node.arguments[0];
          if (firstArg && isDynamic(firstArg)) {
            context.report({
              node: firstArg,
              messageId: "pathTraversal",
              data: { name: callee.property.name },
            });
          }
        }
      },
    };
  },
};

export default rule;
