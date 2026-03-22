# eslint-plugin-securelint

An ESLint plugin that detects security vulnerabilities in your JavaScript/TypeScript code. Get inline warnings and errors directly in your editor.

## Installation

```bash
npm install eslint-plugin-securelint --save-dev
```

## Usage

Add the recommended config to your ESLint configuration:

```js
// eslint.config.js
import securelint from "eslint-plugin-securelint";

export default [
  {
    plugins: { securelint },
    rules: securelint.configs.recommended.rules,
  },
];
```

Or enable individual rules:

```js
export default [
  {
    plugins: { securelint },
    rules: {
      "securelint/no-sql-injection": "warn",
      "securelint/no-eval": "error",
      "securelint/no-hardcoded-secrets": "warn",
      "securelint/no-xss": "error",
      "securelint/no-path-traversal": "warn",
      "securelint/no-command-injection": "error",
    },
  },
];
```

## Rules

| Rule | Default | Description |
|------|---------|-------------|
| `no-sql-injection` | warn | Detects string concatenation/interpolation in SQL query functions |
| `no-eval` | error | Flags `eval()`, `new Function()`, and `setTimeout`/`setInterval` with strings |
| `no-hardcoded-secrets` | warn | Catches hardcoded API keys, passwords, and known token patterns (AWS, GitHub, Slack, etc.) |
| `no-xss` | error | Detects unsafe `innerHTML`, `outerHTML`, `document.write()`, and `dangerouslySetInnerHTML` |
| `no-path-traversal` | warn | Flags dynamic values in filesystem operations (`fs.readFile`, `fs.writeFile`, etc.) |
| `no-command-injection` | error | Detects dynamic strings passed to `exec()`/`execSync()` shell commands |

## Examples

### no-sql-injection

```js
// Bad
db.query("SELECT * FROM users WHERE id = " + userId);
db.query(`DELETE FROM users WHERE id = ${userId}`);

// Good
db.query("SELECT * FROM users WHERE id = ?", [userId]);
```

### no-eval

```js
// Bad
eval(userInput);
new Function("return " + code);
setTimeout("alert(1)", 1000);

// Good
setTimeout(() => alert(1), 1000);
```

### no-hardcoded-secrets

```js
// Bad
const apiKey = "sk-1234567890abcdef1234567890abcdef";
const password = "supersecretpassword123";

// Good
const apiKey = process.env.API_KEY;
```

### no-xss

```js
// Bad
element.innerHTML = userInput;
document.write(htmlContent);

// Good
element.textContent = userInput;
```

### no-command-injection

```js
// Bad
exec(`rm -rf ${userInput}`);

// Good
execFile("rm", ["-rf", sanitizedPath]);
```

## License

MIT
