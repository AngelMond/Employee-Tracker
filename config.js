
const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Codingsql182!!', 
    database: 'hr_db'
  });
  

module.exports = db;