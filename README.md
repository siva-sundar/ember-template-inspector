# ember-template-inspector

An ember add-on which opens the template file in the code editor while inspecting an element. To open the file, `Press ALT(Option) + SHIFT and Click on the element`.

### Demo Video
[![Watch the video](https://i.ytimg.com/vi/erxZqbvrCCo/maxresdefault.jpg)](https://youtu.be/erxZqbvrCCo)

### How this works ?
File locations are added to the html elements during development build and on clicking the element, an api is initiated to the express server which opens the file. This package adds the dev server url to the index.html.


### Supported editors

| Value | Editor | Linux | Windows | OSX |
|--------|------|:------:|:------:|:------:|
| `appcode` | [AppCode](https://www.jetbrains.com/objc/) |  |  |✓|
| `atom` | [Atom](https://atom.io/) |✓|✓|✓|
| `atom-beta` | [Atom Beta](https://atom.io/beta) |  |  |✓|
| `brackets` | [Brackets](http://brackets.io/) |✓|✓|✓|
| `clion` | [Clion](https://www.jetbrains.com/clion/) |  |✓|✓|
| `code` | [Visual Studio Code](https://code.visualstudio.com/) |✓|✓|✓|
| `code-insiders` | [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) |✓|✓|✓|
| `emacs` | [Emacs](https://www.gnu.org/software/emacs/) |✓| | |
| `idea` | [IDEA](https://www.jetbrains.com/idea/) |✓|✓|✓|
| `notepad++` | [Notepad++](https://notepad-plus-plus.org/download/v7.5.4.html) | |✓| |
| `pycharm` | [PyCharm](https://www.jetbrains.com/pycharm/) |✓|✓|✓|
| `phpstorm` | [PhpStorm](https://www.jetbrains.com/phpstorm/) |✓|✓|✓|
| `rubymine` | [RubyMine](https://www.jetbrains.com/ruby/) |✓|✓|✓|
| `sublime` | [Sublime Text](https://www.sublimetext.com/) |✓|✓|✓|
| `vim` | [Vim](http://www.vim.org/) |✓| | |
| `visualstudio` | [Visual Studio](https://www.visualstudio.com/vs/) | | |✓|
| `webstorm` | [WebStorm](https://www.jetbrains.com/webstorm/) |✓|✓|✓|

### Usage

Create a file 'template-inspectorrc.json' in root project folder with the following config to use ember-template-inspector

template-inspectorrc.json (Please add this to your .gitignore file as this is a developer preference)

```
{
  editor: any preferred editor mentioned above, this addon will automatically open a running editor if this is not specified,
  enabled: true | false (true by default)
}
```

### Installation

```
ember install ember-template-inspector
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
