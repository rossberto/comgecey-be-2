const express = require('express');
const addressRouter = express.Router();

const db = require('../../db/database');

addressRouter.get('/', (req, res, next) => {
  const sql = `SELECT * FROM Addresses WHERE Users_id="${req.userId}"`;

  db.query(sql, function(err, address) {
    if (err) {
      next();
    } else {
      res.status(200).send({address: address[0]});
    }
  });
});

addressRouter.post('/', (req, res, next) => {
  const address = req.body;
  address['Users_id'] = req.userId;

  let sql = 'INSERT INTO Addresses SET ?';
  db.query(sql, address, function(err, result) {
    if (err) {
      next();
    } else {
      res.status(201).send('ok');
    }
  });
});

addressRouter.put('/', (req, res, next) => {
  const sql = `UPDATE Addresses SET ? WHERE Users_id="${req.userId}"`;
  db.query(sql, req.body, function(err) {
    if (err) {
      next();
    } else {
      res.status(200).send('ok');
    }
  });
});

module.exports = addressRouter;
