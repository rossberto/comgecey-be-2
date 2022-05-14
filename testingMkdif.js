const fs = require('fs');

fs.mkdir('api/documentos', { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});
