'use strict';
/*eslint-env node */

const path = require('path');
const fs = require('fs');
const { yellow, green } = require('chalk');
const supportedEditors = require('./supported-editors');
const editors = Object.keys(supportedEditors);
const defaultOptions = { enabled: true, editor: editors.join(' or ') };
module.exports = (() => {

  let preferencePath = path.join(process.cwd(), '.template-inspectorrc.json');

  if (!fs.existsSync(preferencePath)) {
    const stringifiedOptions = yellow(JSON.stringify(defaultOptions, null, 2));

    let message = yellow('ember-template-inspector: The default editor is ') + green('"vscode". ') + yellow('To modify the editor or to disable the addon, create a file ') + green('template-inspectorrc.json ') + yellow('under ') + green(`${this.path}/ `) + yellow('folder with the following config\n') + stringifiedOptions;

    console.log(message);
  }

})();
