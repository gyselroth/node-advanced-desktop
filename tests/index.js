const { sidebar, nodeIcon } = require('../lib/main.js');
console.log(sidebar);

sidebar.getItems().then((result) => {
  console.log(result);
});

sidebar.addItem('/Users/testuser/Balloon');

nodeIcon.setFolderIcon('/Users/testuser/Balloon/test', '/Users/testuser/dev/balloon-client-desktop/resources/diricon/icon.png').catch((err) => {console.log(err);})
