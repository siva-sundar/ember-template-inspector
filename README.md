# ember-template-inspector

An ember add-on which opens the template file in the code editor while inspecting an element. To open the file, `Press ALT(Option) + SHIFT and Click on the element`.

### Demo Video
[![Watch the video](https://i.ytimg.com/vi/erxZqbvrCCo/maxresdefault.jpg)](https://youtu.be/erxZqbvrCCo)

### How this works ?
File locations are added to the html elements during development build and on clicking the element, an api is initiated to the express server which opens the file.

### Supported editors

* Atom
* Atom beta
* VS code
* VS code insiders
* VIM

If you are using any other editors, please raise an issue.

### Prerequisite for certain editors
Make sure to install shell command/command line for the respective editors.

**Atom**
1. From the editor, Press Cmd + Shift + P
2. Search for Window: Install Shell Commands and choose the option

**VS CODE**
1. From the editor, Press Cmd + Shift + P
2. Search for Shell Command: Install ‘code’ command in PATH and choose the option.

### Usage

Create a file 'template-inspectorrc.json' in root project folder with the following config to use ember-template-inspector

template-inspectorrc.json (Please add this to your .gitignore file as this is a developer preference)

```
{
  editor: 'atom|atom-beta|vscode|vscode-insiders |vim' (any one),
  enabled: true
}
```

### Installation

```
ember install my-addon
```

### Development

* `git clone <repository-url>` this repository
* `cd ember-template-inspector`
* `yarn`

### Works with
* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


### Contributing
See the [Contributing](CONTRIBUTING.md) guide for details.


### License
This project is licensed under the [MIT License](LICENSE.md).
