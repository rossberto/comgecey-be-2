const express = require('express');
const mailRouter = express.Router();

const db = require('../../db/database');

mailRouter.get('/', (req, res, next) => {
  const sql = `SELECT * FROM MailAddresses WHERE Users_id="${req.userId}"`;

  db.query(sql, function(err, mail) {
    if (err) {
      next();
    } else {
      if (mail.length > 0) {
        res.status(200).send({mail: mail[0]});
      } else {
        res.status(404).send();
      }
    }
  });
});

mailRouter.post('/', (req, res, next) => {
  const mail = req.body;
  mail['Users_id'] = req.userId;

  let sql = 'INSERT INTO MailAddresses SET ?';
  db.query(sql, mail, function(err, result) {
    if (err) {
      next();
    } else {
      res.status(201).send('ok');
    }
  });
});

mailRouter.put('/', (req, res, next) => {
  console.log('en put');
  console.log(req.body);
  const sql = `UPDATE MailAddresses SET ? WHERE Users_id="${req.userId}"`;
  db.query(sql, req.body, function(err) {
    if (err) {
      next();
    } else {
      res.status(200).send('ok');
    }
  });
});

module.exports = mailRouter;
