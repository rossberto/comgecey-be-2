const express = require('express');
const convocatoriesRouter = express.Router();

const db = require('../../db/database');
const uuidv1 = require('uuid/v1'); // Timebase

const sendConfirmation = require('../mailer');

// GET /api/convocatories
convocatoriesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Convocatories';
  db.query(sql, function(err, results) {
    if (err) {
      next(err);
    } else {
      res.status(200).send({convocatories: results});
    }
  });
});

// GET /api/convocatories/open
convocatoriesRouter.get('/open', (req, res, next) => {
  const sql = "SELECT * FROM Convocatories WHERE status='Abierta'";
  db.query(sql, function(err, results) {
    if (err) {
      next(err);
    } else {
      res.status(200).send({convocatories: results});
    }
  });
});

// POST /api/convocatories
convocatoriesRouter.post('/', (req, res, next) => {
  const id = uuidv1();
  req.body.id = id;

  let sql = 'INSERT INTO Convocatories SET ?';
  db.query(sql, req.body, function(err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(209).send('ER_DUP_ENTRY');
      } else {
        next(err);
      }
    } else {
      sql = `SELECT * FROM Convocatories WHERE id="${id}"`;
      db.query(sql, function(err, insertedConvocatory) {
        if (err) {
          next(err);
        } else {
          res.status(201).send({convocatory: insertedConvocatory[0]});
        }
      });
    }
  });
});

convocatoriesRouter.param('convocatoryId', (req, res, next, convocatoryId) => {
  const sql = `SELECT * FROM Convocatories WHERE id="${convocatoryId}" LIMIT 1`;
  db.query(sql, function(err, result) {
    if (err) {
      next(err);
    } else {
      if (result.length > 0) {
        req.convocatoryId = convocatoryId;
        req.convocatory = result[0];
        next();
      } else {
        res.status(404).send();
      }
    }
  });
});

// GET /api/convocatories/:convocatoryId
convocatoriesRouter.get('/:convocatoryId', (req, res, next) => {
  res.status(200).send({convocatory: req.convocatory});
});

// PUT /api/convocatories/:convocatoryId
convocatoriesRouter.put('/:convocatoryId', (req, res, next) => {
  let sql = `UPDATE Convocatories SET ? WHERE id="${req.convocatoryId}"`;
  db.query(sql, req.body, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.status(200).send();
    }
  });
});

const suscribersRouter = require('./suscribers');
convocatoriesRouter.use('/:convocatoryId/suscribers', suscribersRouter);

module.exports = convocatoriesRouter;
