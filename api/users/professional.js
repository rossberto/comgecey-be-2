const express = require('express');
const professionalRouter = express.Router();

const db = require('../../db/database');

professionalRouter.get('/', (req, res, next) => {
  const sql = `SELECT * FROM Professional WHERE Users_id="${req.userId}"`;

  db.query(sql, function(err, professional) {
    if (err) {
      next();
    } else {
      if (professional.length > 0) {
        res.status(200).send({professional: professional[0]});
      } else {
        res.status(404).send();
      }
    }
  });
});

professionalRouter.post('/', (req, res, next) => {
  const professional = req.body;
  professional['Users_id'] = req.userId;

  let sql = 'INSERT INTO Professional SET ?';
  db.query(sql, professional, function(err, result) {
    if (err) {
      next();
    } else {
      res.status(201).send('ok');
    }
  });
});

professionalRouter.put('/', (req, res, next) => {
  const sql = `UPDATE Professional SET ? WHERE Users_id="${req.userId}"`;
  db.query(sql, req.body, function(err) {
    if (err) {
      next();
    } else {
      res.status(200).send('ok');
    }
  });
});

module.exports = professionalRouter;
