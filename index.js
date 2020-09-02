'use strict';
/*eslint no-useless-catch: "off"*/

const { yellow } = require('chalk');
const fs = require('fs');
const path = require('path');
const FileNamePlugin = require('./lib/file-name-plugin')();
const supportedEditors = require('./lib/supported-editors');

const editors = Object.keys(supportedEditors);
const processDir = process.cwd();
const preferencePath = path.join(processDir, 'template-inspectorrc.json');
const isConfigFileExists = fs.existsSync(preferencePath);

let isInspectorEnabled = true;
let editor = 'vscode';

let serverUrl;

function validateAndLoadConfig() {
  if (isConfigFileExists) {
    let content = fs.readFileSync(preferencePath, 'utf-8');
    let inspectorOptions = JSON.parse(content);
    editor = inspectorOptions.editor;
    isInspectorEnabled = inspectorOptions.enabled;

    if (!supportedEditors[editor]) {
      console.warn(yellow(`Editor not supported, please specify one of the following in template-inspectorrc.json \n *${editors.join('\n *')}`));
    }
  }
}


const moduleRootPaths = {};

module.exports = {
  name: require('./package').name,

  serverMiddleware(config) {
    if (!isInspectorEnabled) {
      return;
    }

    let options = config.options;

    let protocol = options.ssl === true ? 'https' : 'http';
    serverUrl = `${protocol}://localhost:${options.port}`;

    config.app.get('/openfile', (req, res, next) => {
      let { file } = req.query;
      let [modulePrefix] = file.split('/');
      let modulePath = moduleRootPaths[modulePrefix];
      file = file.replace(`${modulePrefix}/`, '');


      let [fileName, line, column] = file.split(':');
      let filePath = path.join(modulePath, fileName);

      try {
        if (fs.existsSync(filePath)) {
          supportedEditors[editor]({
            filePath,
            line,
            column
          });
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
    let app = this._findHost();
    return app.env === 'development' && !process.env.CI;
  },

  _setupPreprocessorRegistry(app) {
    if (!isInspectorEnabled) {
      return;
    }
    let { registry } = app;
    let { parent } = this;
    let { root, pkg } = parent;
    let { keywords = [] } = pkg;
    let { options } = this._findHost();

    if (options.name === app.name && options.trees.app === 'tests/dummy/app') {
      moduleRootPaths['dummy'] = `${processDir}/tests/dummy/app`;
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
    let _app = this._findHost();

    if (_app.env === 'development' && !process.env.CI && !isInspectorEnabled) {
      try {
        validateAndLoadConfig();
      } catch(e) {
        throw e;
      }
    }
    this._setupPreprocessorRegistry(app);
  },

  treeFor() {

    if (!isInspectorEnabled) {
      return;
    }

    return this._super.treeFor.call(this, ...arguments);
  },
  contentFor(type) {
    if (type === 'head' && isInspectorEnabled && serverUrl) {
      return `<script>window.emberTemplateInspector = { serverUrl: '${serverUrl}' }</script>`
    }
  }

};
