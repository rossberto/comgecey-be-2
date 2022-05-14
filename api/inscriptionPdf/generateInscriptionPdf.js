const express = require('express');
const formRouter = express.Router();

const db = require('../../db/database');
const generateForm = require('./pdf');

const sendConfirmation = require('../mailer');

// POST /api/users/:userId/form
formRouter.post('/', (req, res, next) => {
  const sql =
    // 'SELECT Users.id, name, father_lname, mother_lname, birthdate, birth_city, birth_state, email, ' +
	  //    'Addresses.street, Addresses.number, Addresses.town, Addresses.city, Addresses.state, Addresses.zip_code, Addresses.phone, ' +
    //    'MailAddresses.street AS mail_street, MailAddresses.number AS mail_number, MailAddresses.town AS mail_town, MailAddresses.city AS mail_city, MailAddresses.state AS mail_state, MailAddresses.zip_code AS mail_zip_code, MailAddresses.phone, ' +
    //    'school, start_date, finish_date, intership, start_date_internship, finish_date_internship, social_service, start_date_social, finish_date_social, ' +
    //    'exam_date, exam_type, tesis, professional_id, professional_id_date, book, ssa ' +
    // 'FROM Users ' +
    // 'JOIN Addresses ON Users.id = Addresses.Users_id ' +
    // 'JOIN MailAddresses ON Users.id = MailAddresses.Users_id ' +
    // 'JOIN Professional ON Users.id = Professional.Users_id ' +
    `SELECT * FROM Users ` +
    `WHERE Users.id='${req.userId}'`;
  db.query(sql, function(err, userDataResponse) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(209).send('ER_DUP_ENTRY');
      } else {
        console.log('no deberia llegar');
        next(err);
      }
    } else {
      userData = userDataResponse[0];
      delete userData['password'];
      console.log(userData);
      generateForm(userData);
      res.status(201).send({userData: userData});
    }
  });
});

module.exports = formRouter;
