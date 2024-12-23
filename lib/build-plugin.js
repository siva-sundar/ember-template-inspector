const FileNamePlugin = require('./file-name-plugin');

module.exports = {
  buildPlugin(params) {
    let { moduleName, appOrAddonIndex, pluginDir } = params;
    return {
      name: 'file-name-plugin',
      plugin: FileNamePlugin({ moduleName, appOrAddonIndex }),
      parallelBabel: {
        requireFile: __filename,
        buildUsing: 'buildPlugin',
        params
      },
      baseDir() {
        return pluginDir;
      }
    };
  },
};
