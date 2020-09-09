'use strict';

const fs = require('fs');
const path = require('path');
const launch = require('launch-editor');
const FileNamePlugin = require('./lib/file-name-plugin')();

const processDir = process.cwd()
const preferencePath = path.join(processDir, 'template-inspectorrc.json');
const isConfigFileExists = fs.existsSync(preferencePath);

let inspectorOptions, editor, serverUrl;

function validateAndLoadConfig() {
  if (isConfigFileExists) {
    let content = fs.readFileSync(preferencePath, 'utf-8');
    inspectorOptions = JSON.parse(content);
    editor = inspectorOptions.editor;
  }
}

const moduleRootPaths = {};

module.exports = {
  name: require('./package').name,

  serverMiddleware(config) {
    if (!(inspectorOptions && inspectorOptions.enabled)) {
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
          // If editor is specified in the config, it will try to load it first.
          // Else, it will load any running editor.
          // If there is no running editor, it will fallback to process.env.EDITOR
          launch(
            `${filePath}:${line}:${column}`,
            editor
          );

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
    if (!(inspectorOptions && inspectorOptions.enabled)) {
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

    if (_app.env === 'development' && !process.env.CI && !inspectorOptions) {
      validateAndLoadConfig();
    }
    this._setupPreprocessorRegistry(app);
  },

  treeFor() {

    if (!(inspectorOptions && inspectorOptions.enabled)) {
      return;
    }

    return this._super.treeFor.call(this, ...arguments);
  },
  contentFor(type) {
    if (type === 'head' && inspectorOptions && inspectorOptions.enabled && serverUrl) {
      return `<script>window.emberTemplateInspector = { serverUrl: '${serverUrl}' }</script>`
    }
  }

};
