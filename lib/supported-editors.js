const { execSync } = require('child_process');

module.exports = {
  atom({ filePath, line, column }) {
    execSync(`atom ${filePath}:${line}:${column}`);
  },

  'atom-beta'({ filePath, line, column }) {
    execSync(`atom-beta ${filePath}:${line}:${column}`);
  },

  vscode({ filePath, line, column }) {
    execSync(`code -g ${filePath}:${line}:${column}`);
  },

  'vscode-insiders'({ filePath, line, column }) {
    execSync(`code-insiders -g ${filePath}:${line}:${column}`);
  },

  vim({ filePath, line, column }) {
    execSync(`vim ${filePath} "+call cursor(${line}, ${column})"`);
  }
}
