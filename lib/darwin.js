const osx = require('../build/Release/addon');

async function getItems() {
  return osx.getItems();
}

async function addItem(node, context) {
  return osx.addItem(node);
}

async function setFolderIcon(node, icon) {
  return exec([
    path.resolve(resourcesPath, 'resources/diricon/osx'),
    'set',
    node,
    icon 
  ].join(' ')); 
}

module.exports = {
  sidebar: {
    getItems: getItems,
    addItem: addItem,
  },
  nodeIcon: {
    setFolderIcon: setFolderIcon
  }
};

