const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',       // change if needed
  user: 'debian-sys-maint',            // your MySQL username
  password: 'tnZtGkC5lFPs1vSe',    // your MySQL password
  database: 'confirmmoney'       // your database name
});

module.exports = pool.promise();
