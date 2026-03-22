"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const no_sql_injection_1 = __importDefault(require("./no-sql-injection"));
const no_eval_1 = __importDefault(require("./no-eval"));
const no_hardcoded_secrets_1 = __importDefault(require("./no-hardcoded-secrets"));
const no_xss_1 = __importDefault(require("./no-xss"));
const no_path_traversal_1 = __importDefault(require("./no-path-traversal"));
const no_command_injection_1 = __importDefault(require("./no-command-injection"));
exports.rules = {
    "no-sql-injection": no_sql_injection_1.default,
    "no-eval": no_eval_1.default,
    "no-hardcoded-secrets": no_hardcoded_secrets_1.default,
    "no-xss": no_xss_1.default,
    "no-path-traversal": no_path_traversal_1.default,
    "no-command-injection": no_command_injection_1.default,
};
