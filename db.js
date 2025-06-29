const mysql = require('mysql2/promise');
console.log('==============================');
console.log('Database connection details:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? '****' : '(empty)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('==============================');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


// Test DB connection at startup
db.getConnection()
  .then(conn => {
    console.log('✅ Database connection successful');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Stop the app if DB is unreachable
  });

module.exports = db;
