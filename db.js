const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',       // change if needed
  user: 'confirmmoney',            // your MySQL username
  password: '58b2eb564d8965765b04',    // your MySQL password
  database: 'confirmmoney'       // your database name
});

module.exports = pool.promise();
