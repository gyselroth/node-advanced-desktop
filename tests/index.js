const { sidebar, nodeIcon } = require('../lib/main.js');
console.log(sidebar);

sidebar.getItems().then((result) => {
  console.log(result);
});
