const fsWin = require('fsWin');
const fs = require('fs');
const Winreg = require('Winreg');
const path = require('path');

async function getItems() {
}

async function addItem(node, context) {
  if(!context.clsId) {
    throw new Error('context.clsId required on win32');
  }
	
  var regKey; 
  regKey = new Winreg({hive: Winreg.HKCU, key: 'HKCU\\Software\\Classes\\CLSID\\'+context.clsId});
  regKey.set(null, 'REG_SZ', context.name, () => {});
}

/*
reg add "HKCU\Software\Classes\CLSID\{%clsId%}" /ve /t REG_SZ /d "Balloon" /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}\DefaultIcon" /ve /t REG_EXPAND_SZ /d %iconFile% /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}" /v System.IsPinnedToNameSpaceTree /t REG_DWORD /d 0x1 /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}" /v SortOrderIndex /t REG_DWORD /d 0x42 /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}\InProcServer32" /ve /t REG_EXPAND_SZ /d %%systemroot%%\system32\shell32.dll /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}\Instance" /v CLSID /t REG_SZ /d {0E5AAE11-A475-4c5b-AB00-C66DE400274E} /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}\Instance\InitPropertyBag" /v Attributes /t REG_DWORD /d 0x11 /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}\Instance\InitPropertyBag" /v TargetFolderPath /t REG_EXPAND_SZ /d %balloonDir% /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}\ShellFolder" /v FolderValueFlags /t REG_DWORD /d 0x28 /f
reg add "HKCU\Software\Classes\CLSID\{%clsId%}\ShellFolder" /v Attributes /t REG_DWORD /d 0xF080004D /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Desktop\NameSpace\{%clsId%}" /ve /t REG_SZ /d Balloon /f
reg add HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\HideDesktopIcons\NewStartPanel /v "{%clsId%}" /t REG_DWORD /d 0x1 /f
*/

async function setFolderIcon(node, icon) {
  var content =
    '[.ShellClassInfo]'+
    'ConfirmFileOp=0'+
    'NoSharing=1'+
    'IconFile='+icon+
    'IconIndex=0';
  
  const ini = path.join(node, 'desktop.ini');
  await fs.writeFile(ini, content);
console.log(ini);
  fsWin.setAttributes(ini, {
    IS_HIDDEN: true,
  }, () => {}, ()=>{});
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
