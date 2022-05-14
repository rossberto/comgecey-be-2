const express = require('express');
const userConvocatoriesRouter = express.Router();

const db = require('../../db/database');

const { sendConvConfirmation, sendNewSuscriberToAdmin } = require('../mailer');

// GET /api/users/:userId/convocatories
userConvocatoriesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT ' +
                'Users_has_Convocatories.status AS user_status, ' +
                'title, Convocatories_id AS id, ' +
                'Convocatories.status AS convocatory_status ' +
              'FROM Users_has_Convocatories ' +
              'JOIN Convocatories ' +
                'ON Users_has_Convocatories.Convocatories_id=Convocatories.id ' +
                //"OR Convocatories.status='Abierta' " +
              `WHERE Users_id='${req.userId}'`;
  db.query(sql, function(err, results) {
    if (err) {
      next(err);
    } else {
      res.status(200).send({userConvocatories: results});
    }
  });
});

// POST /api/users/:userId/convocatories
userConvocatoriesRouter.post('/', (req, res, next) => {
  let sql = `INSERT INTO Users_has_Convocatories (Users_id, Convocatories_id, status) VALUES ("${req.userId}", "${req.body.convocatoryId}", "Pendiente de Revisión")`;
  db.query(sql, function(err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(209).send('ER_DUP_ENTRY');
      } else {
        next(err);
      }
    } else {
      sql = `SELECT email, title FROM Convocatories WHERE id="${req.body.convocatoryId}"`;
      db.query(sql, function(err, insertedUserConv) {
        if (err) {
          next(err);
        } else {
          sendConvConfirmation(req.user.email, insertedUserConv[0].title);
          sendNewSuscriberToAdmin(insertedUserConv[0].email, insertedUserConv[0].title);
          res.status(201).send({userConvocatories: insertedUserConv[0]});
        }
      });
    }
  });
});

/*
userConvocatoriesRouter.param('userId', (req, res, next, userId) => {
  const sql = `SELECT * FROM Users WHERE id="${userId}" LIMIT 1`;
  db.query(sql, function(err, result) {
    if (err) {
      next(err);
    } else {
      if (result.length > 0) {
        req.userId = userId;
        req.user = result[0];
        delete req.user['password'];
        next();
      } else {
        res.status(404).send();
      }
    }
  });
});

// GET /api/users/:userId
userConvocatoriesRouter.get('/:userId', (req, res, next) => {
  res.status(200).send({user: req.user});
});

// PUT /api/users/:userId
userConvocatoriesRouter.put('/:userId', (req, res, next) => {
  let sql = `UPDATE Users SET ? WHERE id="${req.userId}"`;
  db.query(sql, req.body, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.status(200).send('ok');
    }
  });
});
*/

// DELETE /api/users/:userId

module.exports = userConvocatoriesRouter;
