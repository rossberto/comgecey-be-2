const express = require('express');
const convHasPlaceRouter = express.Router();

const db = require('../../db/database');

// GET /api/conv_has_place
convHasPlaceRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Convocatories_has_Places_has_Places';
  db.query(sql, function(err, results) {
    if (err) {
      next(err);
    } else {
      res.status(200).send({conv_has_place: results});
    }
  });
});

// POST /api/conv_has_place
convHasPlaceRouter.post('/', (req, res, next) => {
  let sql = 'INSERT INTO Convocatories_has_Places SET ?';
  db.query(sql, req.body, function(err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(209).send('ER_DUP_ENTRY');
      } else {
        next(err);
      }
    } else {
      sql = `SELECT * FROM Convocatories_has_Places WHERE Convocatories_id="${req.body.Convocatories_id}"`;
      db.query(sql, function(err, insertedConvocatoryPlace) {
        if (err) {
          next(err);
        } else {
          res.status(201).send({convocatory_has_place: insertedConvocatoryPlace[0]});
        }
      });
    }
  });
});

convHasPlaceRouter.param('convocatoryId', (req, res, next, convocatoryId) => {
  const sql = `SELECT * FROM Convocatories_has_Places WHERE Convocatories_id="${convocatoryId}" LIMIT 1`;
  db.query(sql, function(err, result) {
    if (err) {
      next(err);
    } else {
      if (result.length > 0) {
        req.convocatoryId = convocatoryId;
        req.convocatory_has_place = result[0];
        next();
      } else {
        res.status(404).send();
      }
    }
  });
});

// GET /api/conv_has_place/:convocatoryId
convHasPlaceRouter.get('/:convocatoryId', (req, res, next) => {
  res.status(200).send({convocatory_has_place: req.convocatory_has_place});
});

// PUT /api/conv_has_place/:convocatoryId
convHasPlaceRouter.put('/:convocatoryId', (req, res, next) => {
  let sql = `UPDATE Convocatories_has_Places SET ? WHERE Convocatories_id="${req.convocatoryId}"`;
  db.query(sql, req.body, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.status(200).send();
    }
  });
});

module.exports = convHasPlaceRouter;
