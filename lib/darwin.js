const osx = require('../build/Release/addon');
const exec = require('child_process').exec;

async function getItems() {
  var result = [];
  var items = osx.getItems();
  for(let item of items) {
    if(item === '') {
      continue;
    }

    result.push({
      path: item
    });
  }

  return result;
}

async function addItem(node, context) {
  return osx.addItem(parsePath(node));
}

function setFolderIcon(node, icon) {
  return new Promise(async (resolve, reject) => {
    exec([
      'node_modules/fileicon/bin/fileicon',
      'set',
      node,
      icon
    ].join(' '), (error, stdout, stderr) => {
      if(error) {
        reject(error);
      } else if(stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function parsePath(path) {
  if(path.substr(0, 7) !== 'file://') {
    return 'file://'+path;
  }

  return path;
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
