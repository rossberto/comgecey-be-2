const express = require('express');
const newsletterRouter = express.Router();
const db = require('../../db/database');

newsletterRouter.get('/suscribers', (req, res, next) => {
  const sql = 'SELECT * FROM Suscribers';
  db.query(sql, function(err, results) {
    if (err) {
      next(err);
    } else {
      res.status(200).send({suscribers: results});
    }
  });
});

newsletterRouter.post('/suscribers', (req, res, next) => {
  let sql = `INSERT INTO Suscribers (email) VALUES ('${req.body.email}')`;
  db.query(sql, function(err, result) {
    if (err) {
      next(err);
    } else {
      console.log(result.insertId);
      sql = 'SELECT * FROM Suscribers WHERE id = ? LIMIT 1';
      db.query(sql, [result.insertId], function(err, insertedSuscriber) {
        if (err) {
          next(err);
        } else {
          console.log(insertedSuscriber);
          res.status(201).send({suscriber: insertedSuscriber[0]});
        }
      });
    }
  });
});


module.exports = newsletterRouter;
