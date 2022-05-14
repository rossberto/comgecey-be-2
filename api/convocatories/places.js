const express = require('express');
const placesRouter = express.Router();

const db = require('../../db/database');
const uuidv1 = require('uuid/v1'); // Timebase

const sendConfirmation = require('../mailer');

// GET /api/places
placesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Places';
  db.query(sql, function(err, results) {
    if (err) {
      next(err);
    } else {
      res.status(200).send({places: results});
    }
  });
});

// POST /api/places
placesRouter.post('/', (req, res, next) => {
  const id = uuidv1();
  req.body.id = id;
  let sql = 'INSERT INTO Places SET ?';
  
  db.query(sql, req.body, function(err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(209).send('ER_DUP_ENTRY');
      } else {
        next(err);
      }
    } else {
      sql = `SELECT * FROM Places WHERE id="${id}"`;
      db.query(sql, function(err, insertedPlace) {
        if (err) {
          next(err);
        } else {
          res.status(201).send({place: insertedPlace[0]});
        }
      });
    }
  });
});

placesRouter.param('placeId', (req, res, next, placeId) => {
  const sql = `SELECT * FROM Places WHERE id="${placeId}" LIMIT 1`;
  db.query(sql, function(err, result) {
    if (err) {
      next(err);
    } else {
      if (result.length > 0) {
        req.placeId = placeId;
        req.place = result[0];
        next();
      } else {
        res.status(404).send();
      }
    }
  });
});

// GET /api/places/:placeId
placesRouter.get('/:placeId', (req, res, next) => {
  res.status(200).send({place: req.place});
});

// PUT /api/places/:placeId
placesRouter.put('/:placeId', (req, res, next) => {
  let sql = `UPDATE Places SET ? WHERE id="${req.placeId}"`;
  db.query(sql, req.body, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.status(200).send();
    }
  });
});

module.exports = placesRouter;
