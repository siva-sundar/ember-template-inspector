import Service from '@ember/service';

export default class TemplateInspectorService extends Service {
  constructor() {
    super(...arguments);
    let { serverUrl } = window.emberTemplateInspector || {};
    this.serverUrl = serverUrl;

    this.fetchFileInfo();
  }

  async fetchFileInfo() {
    let { serverUrl = '' } = this;
    let { file_location_hash } = await fetch(`${serverUrl}/fileinfo`).then(
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
    let { serverUrl = '' } = this;
    return await fetch(`${serverUrl}/openfile?file=${loc}`);
  }
}
