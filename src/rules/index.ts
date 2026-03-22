import noSqlInjection from "./no-sql-injection";
import noEval from "./no-eval";
import noHardcodedSecrets from "./no-hardcoded-secrets";
import noXss from "./no-xss";
import noPathTraversal from "./no-path-traversal";
import noCommandInjection from "./no-command-injection";

export const rules = {
  "no-sql-injection": noSqlInjection,
  "no-eval": noEval,
  "no-hardcoded-secrets": noHardcodedSecrets,
  "no-xss": noXss,
  "no-path-traversal": noPathTraversal,
  "no-command-injection": noCommandInjection,
};
