'use strict';

const { yellow, red } = require('chalk');
const fs = require('fs');
const path = require('path');
const FileNamePlugin = require('./lib/file-name-plugin')();
const supportedEditors = require('./lib/supported-editors');

const editors = Object.keys(supportedEditors);
const processDir = process.cwd()
const preferencePath = path.join(processDir, 'template-inspectorrc.json');
const isConfigFileExists = fs.existsSync(preferencePath);

let inspectorOptions, editor, serverUrl;

function validateAndLoadConfig() {
  if (isConfigFileExists) {
    let content = fs.readFileSync(preferencePath, 'utf-8');
    inspectorOptions = JSON.parse(content);
    editor = inspectorOptions.editor;

    if (!supportedEditors[editor]) {
      throw new Error(`Editor not supported, please specify one of the following in template-inspectorrc.json \n *${editors.join('\n *')}`);
    }
  } else {
    let projectRoot = processDir.split('/').pop();
    let message = red(`\nKindly create a file ${yellow("'template-inspectorrc.json'")} under ${yellow(projectRoot + '/')} folder with the following config to use ember-template-inspector\n`);

    message += yellow(JSON.stringify({ enabled: true, editor: editors.join(' or ') }, null, 2));

    throw new Error(message);
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
