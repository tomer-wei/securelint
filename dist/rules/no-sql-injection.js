"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    meta: {
        type: "problem",
        docs: {
            description: "Disallow string concatenation or template literals in SQL query functions",
            recommended: true,
        },
        messages: {
            sqlInjection: "Potential SQL injection: avoid using {{type}} in SQL queries. Use parameterized queries instead.",
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
        const sqlKeywordPattern = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|UNION|FROM|WHERE)\b/i;
        function isSqlString(node) {
            if (node.type === "Literal" && typeof node.value === "string") {
                return sqlKeywordPattern.test(node.value);
            }
            if (node.type === "TemplateLiteral") {
                const quasis = node.quasis;
                return quasis.some((q) => sqlKeywordPattern.test(q.value.raw));
            }
            return false;
        }
        function checkCallExpression(node) {
            const callee = node.callee;
            let funcName = null;
            if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
                funcName = callee.property.name;
            }
            else if (callee.type === "Identifier") {
                funcName = callee.name;
            }
            if (!funcName || !sqlFunctionNames.has(funcName))
                return;
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
        function containsSqlString(node) {
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
        function containsNonLiteral(node) {
            if (node.type === "Literal")
                return false;
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
exports.default = rule;
