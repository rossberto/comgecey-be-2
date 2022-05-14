const express = require('express');
const pwdRecoveryRouter = express.Router();

const db = require('../../db/database');
const { sendPwd } = require('../mailer');

pwdRecoveryRouter.post('/', (req, res, next) => {
  const sql = `SELECT * FROM Users WHERE email='${req.body.email}'`;
  db.query(sql, function(err, users) {
    if (err) {
      next(err);
    } else {
      sendPwd(users[0].email, users[0].password);

      res.status(201).send();
    }
  }
)});

module.exports = pwdRecoveryRouter;
