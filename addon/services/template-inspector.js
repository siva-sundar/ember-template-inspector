import Service from '@ember/service';

export default class TemplateInspectorService extends Service {
  constructor() {
    super(...arguments);
    let { serverUrl } = window.emberTemplateInspector || {};
    this.serverUrl = serverUrl;

    this.fetchFileInfo();
  }

  async fetchFileInfo() {
    let { file_location_hash } = await fetch(`${this.serverUrl}/fileinfo`).then(
      (res) => res.json()
    );
    this.fileLocationHash = file_location_hash;
  }

  getFileInfo(fileInfo) {
    let [appOrAddon, fileIndex, line, column] = fileInfo.split(':');
    let fileName = this.fileLocationHash[appOrAddon].files[fileIndex];

    return `${fileName}:${line}:${column}`;
  }

  async openFile(loc) {
    return await fetch(`${this.serverUrl}/openfile?file=${loc}`);
  }
}
