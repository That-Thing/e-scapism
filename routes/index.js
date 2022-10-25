var express = require('express');
var router = express.Router();
const fs = require('fs'); //filesync
let config = JSON.parse(fs.readFileSync('config/config.json'));
const mysql = require('mysql');
const { response, application } = require('express');
const { connect } = require('http2');
const connection = mysql.createConnection({
  host: config['database']['host'],
  user: config['database']['user'],
  password: config['database']['password'],
  database: config['database']['name']
});
/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM `forums`', function (error, rows) {
    res.render('index', { config: config, forums: rows });
  })
});

module.exports = router;
