const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kkkkk444',
    database: 'english_test_db',
});

db.connect((err) => {
    if (err) {
        console.error('Nie można połączyć z bazą danych:', err);
        process.exit(1);
    }
    console.log('Połączono z bazą danych');
});

module.exports = db;
