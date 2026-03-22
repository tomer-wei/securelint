import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded secrets, API keys, and passwords in source code",
      recommended: true,
    },
    messages: {
      hardcodedSecret:
        "Potential hardcoded secret in '{{name}}'. Use environment variables or a secrets manager instead.",
    },
    schema: [],
  },
  create(context) {
    const secretKeyPattern =
      /^(api[_-]?key|api[_-]?secret|auth[_-]?token|access[_-]?token|secret[_-]?key|private[_-]?key|password|passwd|credentials|client[_-]?secret|encryption[_-]?key|jwt[_-]?secret|session[_-]?secret|db[_-]?password|database[_-]?password)$/i;

    // Known high-entropy patterns for API keys / tokens
    const tokenPatterns = [
      /^sk-[a-zA-Z0-9]{20,}$/,          // OpenAI-style
      /^ghp_[a-zA-Z0-9]{36,}$/,         // GitHub personal access token
      /^gho_[a-zA-Z0-9]{36,}$/,         // GitHub OAuth
      /^github_pat_[a-zA-Z0-9_]{30,}$/, // GitHub fine-grained PAT
      /^xox[bpas]-[a-zA-Z0-9\-]+$/,     // Slack tokens
      /^AKIA[0-9A-Z]{16}$/,             // AWS access key
      /^glpat-[a-zA-Z0-9\-_]{20,}$/,   // GitLab PAT
    ];

    function isSecretVariableName(name: string): boolean {
      return secretKeyPattern.test(name);
    }

    function looksLikeToken(value: string): boolean {
      return tokenPatterns.some((pattern) => pattern.test(value));
    }

    function isNonTrivialString(value: string): boolean {
      // Ignore empty, placeholder, or very short values
      if (value.length < 8) return false;
      if (/^(test|example|placeholder|changeme|xxx|todo|your[_-])/i.test(value)) return false;
      return true;
    }

    function checkAssignment(nameNode: any, valueNode: any) {
      if (!valueNode || valueNode.type !== "Literal" || typeof valueNode.value !== "string") {
        return;
      }

      const name =
        nameNode.type === "Identifier"
          ? nameNode.name
          : nameNode.type === "Property" && nameNode.key.type === "Identifier"
            ? nameNode.key.name
            : null;

      if (!name) return;

      if (isSecretVariableName(name) && isNonTrivialString(valueNode.value)) {
        context.report({
          node: valueNode,
          messageId: "hardcodedSecret",
          data: { name },
        });
        return;
      }

      if (looksLikeToken(valueNode.value)) {
        context.report({
          node: valueNode,
          messageId: "hardcodedSecret",
          data: { name },
        });
      }
    }

    return {
      VariableDeclarator(node: any) {
        checkAssignment(node.id, node.init);
      },
      AssignmentExpression(node: any) {
        const left = node.left;
        if (left.type === "MemberExpression" && left.property.type === "Identifier") {
          checkAssignment(left.property, node.right);
        } else {
          checkAssignment(left, node.right);
        }
      },
      Property(node: any) {
        checkAssignment(node, node.value);
      },
    };
  },
};

export default rule;
