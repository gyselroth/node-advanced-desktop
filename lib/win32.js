const fsWin = require('fsWin');
const fs = require('fs');
const Winreg = require('Winreg');
const path = require('path');
const util = require('util');

function getItems() {
  var result = [];

  return new Promise(async (resolve, reject) => {
    var regKey;
    regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Classes\\CLSID'});
    var items = await promisfyRegKeys(regKey);
    var tasks = [];

    for (let item of items) {
      regKey = new Winreg({hive: Winreg.HKCU, key: item.key+'\\Instance\\InitPropertyBag'});
      tasks.push(promisfyRegValues(regKey).catch(()=>{}).then((items) => {
        if(!items) {
          return;
        }

        for (let item of items) {
          if(item.name === 'TargetFolderPath') {
            result.push({
              path: item.value
            })
          }
        }
      }));
    }

    await Promise.all(tasks);
    resolve(result);
  });
}

function promisfyRegKeys(key) {
  return new Promise((resolve, reject) => {
    key.keys((err, items) => {
        if(err) {
          reject(err);
        } else {
          resolve(items);
        }
    });
  });
}

function promisfyRegValues(key) {
  return new Promise((resolve, reject) => {
    key.values((err, items) => {
        if(err) {
          reject(err);
        } else {
          resolve(items);
        }
    });
  });
}

async function addItem(node, context) {
  if(!context.clsId) {
    throw new Error('context.clsId required on win32');
  }

  if(!context.name) {
    throw new Error('context.name required on win32');
  }

  var regKey;
  regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Classes\\CLSID\\{'+context.clsId+'}'});
  regKey.set('', 'REG_SZ', context.name, (result) => {});
  regKey.set('System.IsPinnedToNameSpaceTree', 'REG_DWORD', '0x1', (result) => {});
  regKey.set('SortOrderIndex', 'REG_DWORD', '0x42', (result) => {});

  if(context.icon) {
    regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Classes\\CLSID\\{'+context.clsId+'}\\DefaultIcon'});
    regKey.set('', 'REG_EXPAND_SZ', context.icon, (result) => {});
  }

  regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Classes\\CLSID\\{'+context.clsId+'}\\InProcServer32'});
  regKey.set('', 'REG_EXPAND_SZ', '%systemroot%\\system32\\shell32.dll', (result) => {});
  regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Classes\\CLSID\\{'+context.clsId+'}\\Instance'});
  regKey.set('CLSID', 'REG_SZ', '{0E5AAE11-A475-4c5b-AB00-C66DE400274E}', (result) => {});
  regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Classes\\CLSID\\{'+context.clsId+'}\\Instance\\InitPropertyBag'});
  regKey.set('Attributes', 'REG_DWORD', '0x11', (result) => {});
  regKey.set('TargetFolderPath', 'REG_EXPAND_SZ', node, (result) => {});
  regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Classes\\CLSID\\{'+context.clsId+'}\\ShellFolder'});
  regKey.set('FolderValueFlags', 'REG_DWORD', '0x28', (result) => {});
  regKey.set('Attributes', 'REG_DWORD', '0xF080004D', (result) => {});
  regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Desktop\\NameSpace\\{'+context.clsId+'}'});
  regKey.set('', 'REG_SZ', context.name, (result) => {});
  regKey = new Winreg({hive: Winreg.HKCU, key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\HideDesktopIcons\\NewStartPanel'});
  regKey.set('{'+context.clsId+'}', 'REG_DWORD', '0x1', (result) => {});
}

function setFolderIcon(node, icon) {
  var content = "[.ShellClassInfo]\
    ConfirmFileOp=0\
    NoSharing=1\
    IconFile="+icon+"\
    IconIndex=0";

  return new Promise(async (resolve, reject) => {
    const ini = path.join(node, 'desktop.ini');

    if(fs.existsSync(ini)) {
      fs.unlinkSync(ini);
    }

    await fs.writeFile(ini, content);

    fsWin.setAttributes(ini, {
      IS_HIDDEN: true,
    }, (result) => {
      resolve(result);
    }, (error)=> {
      reject(error);
    });
  });
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
