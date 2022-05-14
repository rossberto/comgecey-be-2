const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql');


// console.log('Local Database...');
// const connection = mysql.createPool({
//   multipleStatements: true,
//   host    : 'localhost',
//   user    : 'root',
//   password: 'ironhack',
//   database: 'mydb'
// });


/*
console.log(process.env.DB_HOST_A2);
console.log(process.env.DB_USER_A2);
console.log(process.env.DB_PASSWORD_A2);
console.log(process.env.DB_SCHEMA_A2);
*/
console.log('Remote Database...');
const connection = mysql.createConnection({
  host    : 'localhost',//process.env.DEV_DB_HOST_A2,
  user    : 'root',//process.env.DEV_DB_USER_A2,
  password: '7896',//process.env.DEV_DB_PASSWORD_A2,
  database: 'mydb'//process.env.DEV_DB_SCHEMA_A2
});

//console.log(connection);

// connection.getConnection(function(err, connection) {
//   if (err) throw err;
//   console.log("Connected!");
// });

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = connection;
