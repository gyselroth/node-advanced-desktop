const os = require('os');
const path = require('path');
const { sidebar, nodeIcon } = require('../lib/main.js');
const fs = require('fs');

var testdir = path.join(os.tmpdir(), 'foobar');

if(!fs.existsSync(testdir)) {
  fs.mkdirSync(testdir);
}

sidebar.getItems().then((result) => {
  console.log(result);
});

var icon = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
icon = path.resolve(__dirname, icon);

sidebar.ensureItem(testdir, {
  clsId: "61736CCB-50DB-4095-BF4C-186BB668432C",
  icon: icon
});

nodeIcon.setFolderIcon(testdir, icon).catch((err) => {console.log(err);})
