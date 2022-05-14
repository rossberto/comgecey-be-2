const express = require('express');
const documentsRouter = express.Router();
const helmet = require('helmet');

documentsRouter.use('/', helmet.frameguard(), express.static('documentos/solicitudes'));

module.exports = documentsRouter;
