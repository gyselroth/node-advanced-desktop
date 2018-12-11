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

async function ensureItem(node, context) {
  return osx.addItem(parsePath(node));
}

function setFolderIcon(node, icon, context) {
  return new Promise(async (resolve, reject) => {
    var cmd = 'node_modules/fileicon/bin/fileicon';

    if(context && context.cmd) {
      cmd = context.cmd;
    }

    exec([
      cmd,
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
    ensureItem: ensureItem,
  },
  nodeIcon: {
    setFolderIcon: setFolderIcon
  }
};
