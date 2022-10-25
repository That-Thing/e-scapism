//Connection to MySQL database
const config = require('../modules/config');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: config['database']['host'],
    user: config['database']['user'],
    password: config['database']['password'],
    database: config['database']['name']
});
connection.connect(function(err) {
    if (err) throw err;
});
module.exports = connection;