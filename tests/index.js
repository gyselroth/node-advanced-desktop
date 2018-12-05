const { sidebar, nodeIcon } = require('../lib/main.js');
console.log(sidebar);

sidebar.getItems().then((result) => {
  console.log(result);
});

sidebar.addItem('C:\Users\Raffael\Balloon\build', {
  clsId: "05C645AA-6AA4-406B-B033-9142E21ECC5F"
});

nodeIcon.setFolderIcon('/Users/testuser/Balloon/test', '/Users/testuser/dev/balloon-client-desktop/resources/diricon/icon.png').catch((err) => {console.log(err);})
