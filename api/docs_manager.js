const fs = require('fs');

function createUserDir(id) {
  fs.mkdir('api/documents/' + id, { recursive: true }, (err) => {
    if (err) {
      throw err;
      return 'Problem'
    }
  });

  return 'Directory created';
}

module.exports = {
  createUserDir
}
