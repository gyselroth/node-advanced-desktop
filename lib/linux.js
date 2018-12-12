const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');
const homeDir = process.env['HOME'];
const fs = require('fs');
const prependFile = require('prepend-file');

async function getDefault() {
  var result = await exec('xdg-mime query default inode/directory');

  if(result.stdout.search(/nautilus/i) !== -1) {
    return 'nautilus';
  } else if(result.stdout.search(/nemo/i) !== -1) {
    return 'nemo';
  } else {
    throw new Error('Unknown file manager '+result.stdout);	
  }
}

function getGtkItems() {
  return new Promise((resolve, reject) => {
    const gtk = path.join(homeDir, '.config', 'gtk-3.0');
    if(fs.existsSync(gtk)) {
      const bookmarks = path.join(gtk, 'bookmarks');

      if(fs.existsSync(bookmarks)) {
        var result = [];
        var lineReader = require('readline').createInterface({
          input: fs.createReadStream(bookmarks)
        });

        lineReader.on('line', function (line) {
          result.push({
            path: line
          });
        });

        lineReader.on('close', async () => {
          resolve(result);
        });
      } else {
        resolve(result);
      }
    } else {
      reject(new Error('gtk-3.0 folder does not exists'));
    }
  });
}

async function addGtkItem(node) {
  const existing = await getGtkItems();
  const gtk = path.join(homeDir, '.config', 'gtk-3.0');

  if(fs.existsSync(gtk)) {
    const bookmarks = path.join(gtk, 'bookmarks');

    if(fs.existsSync(bookmarks)) {
      fs.readFile(bookmarks, function (err, data) {
        if (err) throw err;
        if(data.indexOf('file://'+node+"\n") === -1){
          prependFile(bookmarks, 'file://'+node+"\n", function (err) {
            if (err) throw err;
          });
        }
      })
    } else {
      fs.writeFile(bookmarks, 'file://'+node+"\n", function (err) {
        if (err) throw err;
      });
    }
  }
}

async function getItems() {
  var name = await getDefault();

  switch(name) {
    case 'nemo':
    case 'nautilus':
      return getGtkItems();
    break;
    default:
      throw new Error('unknown file manager');
  }
}

async function ensureItem(node, context) {
  var name = await getDefault();

  switch(name) {
    case 'nemo':
    case 'nautilus':
      return addGtkItem(node);
    break;
    default:
      throw new Error('unknown file manager');
  }
}

async function setFolderIcon(node, icon, context) {
  return exec([
    'gvfs-set-attribute',
    node,
    'metadata::custom-icon',
    icon
  ].join(' '));
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
