import Service from '@ember/service';

export default class TemplateInspectorService extends Service {
  constructor() {
    super(...arguments);
    let { serverUrl } = window.emberTemplateInspector || {};
    this.serverUrl = serverUrl;
  }

  getFileInfo(fileInfo) {
    let [_, fileName, line, column] = fileInfo.split(':');
    return `${fileName}:${line}:${column}`;
  }

  async openFile(loc) {
    let { serverUrl = '' } = this;
    return await fetch(`${serverUrl}/openfile?file=${loc}`);
  }
}
