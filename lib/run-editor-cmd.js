const { execSync } = require('child_process');

module.exports = function({ editor, filePath, line, column }) { //include any other editor cli commands if required
  if (editor === 'atom') {
    execSync(`atom ${filePath}:${line}:${column}`);
  }
  if (editor === 'vscode') {
    execSync(`code -g ${filePath}:${line}:${column}`);
  }
  if (editor === 'atom-beta') {
    execSync(`atom-beta ${filePath}:${line}:${column}`);
  }
  if (editor === 'vscode-insiders') {
    execSync(`code-insiders -g ${filePath}:${line}:${column}`);
  }
  if (editor === 'vim') {
    execSync(`vim ${filePath} "+call cursor(${line}, ${column})"`);
  }
}
