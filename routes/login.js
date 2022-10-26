var express = require('express');
var router = express.Router();
const crypto = require("crypto");
const { body, validationResult } = require('express-validator');
const config = require('../modules/config');
const { response, application } = require('express');
const { connect } = require('http2');
const connection = require('../modules/connection');
const app = require('../app');
//Get login page
router.get('/', function(req, res) {
    res.render('login', { config: config, loggedIn: req.session.loggedIn });
});
//Post log in form
router.post('/', body('username').not().isEmpty().trim().escape(), body('password').not().isEmpty().trim().escape(), function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if(username == "" || password == "") { //if any fields are empty
        return res.render('login', { config: config, error: "Please fill out all fields." });
    }
    password = crypto.createHash('sha256').update(password+config['server']['salt']).digest('base64'); //Hash password
    connection.query(`SELECT * FROM accounts WHERE LOWER(username) = '${username.toLowerCase()}' AND password = '${password}'`, function (error, result) {
      if (error) throw error;
      if(result.length > 0) {
          req.session.user = result[0].id;
          req.session.username = result[0].username;
          req.session.loggedIn = true;
          req.session.group = result[0].perms;
          res.redirect('/'); //Redirect to home page
      } else {
          res.render('login', { config: config, error: "Incorrect username or password." });
      }
    });
});

module.exports = router;