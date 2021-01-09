import Service from '@ember/service';

export default class TemplateInspectorService extends Service {
  constructor() {
    super(...arguments);
    let { serverUrl } = window.emberTemplateInspector || {};
    this.serverUrl = serverUrl;
  }

  async getFileInfo(loc) {
    return await fetch(`${this.serverUrl}/fileinfo?file=${loc}`).then(res => res.json());
  }

  async openFile(loc) {
    return await fetch(`${this.serverUrl}/openfile?file=${loc}`);
  }
}
