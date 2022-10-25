var express = require('express');
var router = express.Router();
const fs = require('fs'); //filesync
let config = JSON.parse(fs.readFileSync('config/config.json'));
const mysql = require('mysql');
const { response, application } = require('express');
const { connect } = require('http2');
const app = require('../app');
const connection = mysql.createConnection({
  host: config['database']['host'],
  user: config['database']['user'],
  password: config['database']['password'],
  database: config['database']['name']
});

router.get('/login', function(req, res) {
    res.render('login', { config: config });
});
router.get('/register', function(req, res) {
    res.render('register', { config: config });
});

module.exports = router;
