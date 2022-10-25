var express = require('express');
var router = express.Router();
const connection = require('../modules/connection');
const config = require('../modules/config');
const { response, application } = require('express');
const { connect } = require('http2');
/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM `forums`', function (error, rows) {
    res.render('index', { config: config, forums: rows, group: req.session.group, loggedIn: req.session.loggedIn });
  })
});

module.exports = router;
