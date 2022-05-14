const express = require('express');
const registerRouter = express.Router();

const db = require('../../db/database');
const uuidv1 = require('uuid/v1'); // Timebase

const { sendConfirmation } = require('../mailer');


//user_arr = [name, father_lname, mother_lname, birthdate, birth_city, birth_state]
// POST /api/register
registerRouter.post('/', (req, res, next) => {
  console.log('inside register/')

  const id = uuidv1();
  let sql = `INSERT INTO Users (id, email, password) VALUES ("${id}", "${req.body.email}", "${req.body.password}")`;
  db.query(sql, function(err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(209).send('ER_DUP_ENTRY');
      } else {
        next(err);
      }
    } else {
      sql = `SELECT id, email FROM Users WHERE id="${id}"`;
      db.query(sql, function(err, insertedUser) {
        if (err) {
          next(err);
        } else {
          sendConfirmation(insertedUser[0].email, id);
          res.status(201).send({user: insertedUser[0]});
        }
      });
    }
  });
});


registerRouter.param('userId', (req, res, next, userId) => {
  const sql = `SELECT * FROM Users WHERE id="${userId}" LIMIT 1`;
  db.query(sql, function(err, result) {
    if (err) {
      console.log('error shit')
      next(err);
    } else {
      if (result.length > 0) {
        req.userId = userId;
        req.user = result[0];
        delete req.user['password'];

        if (req.user.confirmed == 0) {
          next();
        } else {
          res.status(401).send('No autorizado: Usuario ya ha sido registrado');
        }
      } else {
        res.status(404).send();
      }
    }
  });
});

// GET /api/register/:userId
registerRouter.get('/:userId', (req, res, next) => {
  res.status(200).send({user: req.user});
});

// PUT /api/register/:userId
registerRouter.put('/:userId', (req, res, next) => {
  let sql = `UPDATE Users SET ? WHERE id="${req.userId}"`;
  db.query(sql, req.body, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.status(200).send('ok');
    }
  });
});

registerRouter.delete('/:userId', (req, res, next) => {
  const sql = `DELETE FROM Users WHERE id='${req.userId}'`;
  db.query(sql, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.status(204).send();
    }
  });
});

// const addressRouter = require('../users/address');
// registerRouter.use('/:userId/address', addressRouter);

// const mailRouter = require('../users/mail');
// registerRouter.use('/:userId/mail', mailRouter);

// const professionalRouter = require('../users/professional');
// registerRouter.use('/:userId/professional', professionalRouter);

const formRouter = require('../inscriptionPdf/generateInscriptionPdf');
registerRouter.use('/:userId/form', formRouter);

const documentsRouter = require('../users/documents');
registerRouter.use('/:userId/documents', documentsRouter);

const filesRouter = require('../users/files');
registerRouter.use('/:userId/files', filesRouter);

// const userConvocatoriesRouter = require('../users/convocatories');
// registerRouter.use('/:userId/convocatories', userConvocatoriesRouter);

// DELETE /api/users/:userId

module.exports = registerRouter;
