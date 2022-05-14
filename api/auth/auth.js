const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db/database');

const authRouter = express.Router();

const jwtConfig = {
    "secret"   : process.env.JWT_SECRET,
    "expiresIn": 3600 //"2 days" // A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc)
};


// GET /api/auth
authRouter.post('/', (req, res, next) => {
  const sql = `SELECT * FROM Users WHERE email='${req.body.email}'`;
  db.query(sql, function(err, users) {
    if (err) {
      next(err);
    } else {
      if (users.length === 1) {
        if (users[0].password === req.body.password && users[0].confirmed > 3) {
          delete users[0]['password'];
          delete users[0]['confirmed'];

          const access_token = jwt.sign({id: users[0].id}, jwtConfig.secret, {expiresIn: jwtConfig.expiresIn});

          res.status(201).send({user: users[0], access_token: access_token});
        } else {
          res.status(401).send();
        }
      } else {
        res.status(404).send();
      }
    }
  });
});

module.exports = authRouter;
