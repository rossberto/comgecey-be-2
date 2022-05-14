const express = require('express');
const imgsRouter = express.Router();

imgsRouter.get('/hello', (req, res, next) => {
  res.status(200).send('Hello!')
});

module.exports = imgsRouter;
