# Advanced desktop operations on node.js

[![Build status](https://ci.appveyor.com/api/projects/status/ym07006bvsrjo698?svg=true)](https://ci.appveyor.com/project/raffis/node-advanced-desktop)
[![Build Status](https://travis-ci.org/gyselroth/node-advanced-desktop.svg?branch=master)](https://travis-ci.org/gyselroth/node-advanced-desktop)
[![GitHub release](https://img.shields.io/github/release/gyselroth/node-advanced-desktop.svg)](https://github.com/gyselroth/node-advanced-desktop/releases)
[![npm](https://img.shields.io/npm/v/@gyselroth/node-advanced-desktop.svg)](https://www.npmjs.com/package/@gyselroth/node-advanced-desktop)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/gyselroth/node-advanced-desktop/master/LICENSE) 

Provides more desktop functionalities (Including bookmarks/sidebar elements and folder icons) and offers cross os support for Linux, Windows and OS X.

## Install
```
npm install --save @gyselroth/node-advanced-desktop
```

## Usage

### Set folder icon `nodeIcon.setFolderIcon: Promise()`

Set an icon for a given folder path.
**Note**: On win32 an icon of type ico is required.

```javascript
const { nodeIcon } = require('@gyselroth/node-advanced-desktop');
var icon = process.platform === 'win32' ? 'icon.ico' : 'icon.png';

nodeIcon.setFolderIcon('/my/path/to/folder', icon).then(() => {
  console.log('folder icon set');
}).catch((error) => {
  console.log('failure');
});
```

### Add item to sidebar `sidebar.ensureItem: Promise()`

Adds an item, typically a folder, to the sidebar (folder bookmarks).
`sidebar.ensureItem(path, context)` accepts a context as seccond argument whereas you may specify additional configuration.
**Note**: On win32 you are required to specify a [clsId](https://docs.microsoft.com/en-us/windows/desktop/com/clsid-key-hklm). You may also change the name of the sidebar entry on win32 using context.name (The default is the base folder name).

Additional notes for linux, if the linux distribution is supported depends what file manager is in use. Currently support for the followin file managers is implemented:

* nautilus
* nemo

```javascript
const { sidebar } = require('@gyselroth/node-advanced-desktop');
var icon = process.platform === 'win32' ? 'icon.ico' : 'icon.png';

sidebar.ensureItem('/my/path/to/folder', {
  clsId: "61736CCB-50DB-4095-BF4C-186BB668432C",
  name: "foobar",
  icon: icon
}).then(() => {
  console.log('sidebar entry added');
}).catch((error) => {
  console.log('failure');
});
```

This method will only add the element if it does not already exists.

### List sidebar items `sidebar.getItems(): Promise(list)`

List current sidebar items:

```javascript
const { sidebar } = require('@gyselroth/node-advanced-desktop');

sidebar.getItems().then((list) => {
  for(let item of list) {
    console.log(item.path);
  }
});
