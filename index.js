'use strict';

const { yellow, red } = require('chalk');
const fs = require('fs');
const path = require('path');
const FileNamePlugin = require('./lib/file-name-plugin')();
const runEditorCMD = require('./lib/run-editor-cmd');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const isDevelopment = EmberApp.env() === 'development';

const currentDir = process.cwd()
const preferencePath = path.join(currentDir, 'template-inspectorrc.json');
const projectFolderName = currentDir.split('/').pop();


let isInspectorEnabled, editor, serverUrl;

if (fs.existsSync(preferencePath)) {
  let content = fs.readFileSync(preferencePath, 'utf-8');
  ({ editor, enabled: isInspectorEnabled } = JSON.parse(content));
} else if (isDevelopment && !process.env.CI) {

  console.log(red(`Kindly create a file 'template-inspectorrc.json' under ${projectFolderName} folder with the following config to use ember-template-inspector`));
  console.log(yellow(JSON.stringify({ enabled: true, editor: 'atom or vscode '}, null, 2)));

  process.exit(1); //eslint-disable-line
}


const moduleRootPaths = {};

module.exports = {
  name: require('./package').name,

  serverMiddleware(config) {
    let options = config.options;

    let protocol = options.ssl === true ? 'https' : 'http';
    serverUrl = `${protocol}://localhost:${options.port}`;

    config.app.get('/openfile', (req, res, next) => {
      let { file } = req.query;
      let [modulePrefix] = file.split('/');
      let modulePath = moduleRootPaths[modulePrefix];

      if (file.match(/.*templates\//)) {
        file = file.replace(/.*templates\//, 'templates/');
      } else if (file.match(/.*components\//, 'components/')) {
        file = file.replace(/.*components\//, 'components/');
      }

      let [fileName, line, column] = file.split(':');
      let filePath = path.join(modulePath, fileName);

      try {
        if (fs.existsSync(filePath)) {
          runEditorCMD({ filePath, line, column, editor });
          res.send('File opened');
        } else {
          next(new Error('File not found'));
        }
      } catch(exception) {
        next(exception);
      }
    });
  },

  isEnabled() {
    return isDevelopment && isInspectorEnabled && !process.env.CI;
  },

  _setupPreprocessorRegistry(app) {
    let { registry } = app;
    let { parent } = this;
    let { root, pkg } = parent;
    let { keywords = [] } = pkg;
    let { options } = this._findHost();

    if (options.name === app.name && options.trees.app === 'tests/dummy/app') {
      moduleRootPaths['dummy'] = `${currentDir}/tests/dummy/app`;
    } else {
      let name = typeof parent.name === 'function' ? parent.name() : parent.name;
      moduleRootPaths[name] = keywords.includes('ember-addon') ? `${root}/addon` : `${root}/app`;
    }

    registry.add('htmlbars-ast-plugin', {
      name: 'file-name-plugin',
      plugin: FileNamePlugin,
      baseDir() {
        return __dirname;
      }
    });
  },

  included(app) {
    this._super.included.apply(this, arguments);
    this._setupPreprocessorRegistry(app);
  },


  contentFor(type) {
    if (type === 'head') {
      return `<script>window.emberTemplateInspector = { serverUrl: '${serverUrl}' }</script>`
    }
  }

};
