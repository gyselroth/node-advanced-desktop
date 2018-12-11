var controller;

switch(process.platform) {
  case 'win32':
    controller = require('./win32');
  break;

  case 'darwin':
    controller = require('./darwin');
  break;

  default:
  case 'linux':
    controller = require('./linux');
}

module.exports = controller;
