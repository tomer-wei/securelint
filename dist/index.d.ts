declare const plugin: {
    rules: {
        "no-sql-injection": import("eslint").Rule.RuleModule;
        "no-eval": import("eslint").Rule.RuleModule;
        "no-hardcoded-secrets": import("eslint").Rule.RuleModule;
        "no-xss": import("eslint").Rule.RuleModule;
        "no-path-traversal": import("eslint").Rule.RuleModule;
        "no-command-injection": import("eslint").Rule.RuleModule;
    };
    configs: {
        recommended: {
            plugins: string[];
            rules: {
                "securelint/no-sql-injection": string;
                "securelint/no-eval": string;
                "securelint/no-hardcoded-secrets": string;
                "securelint/no-xss": string;
                "securelint/no-path-traversal": string;
                "securelint/no-command-injection": string;
            };
        };
    };
};
export = plugin;
