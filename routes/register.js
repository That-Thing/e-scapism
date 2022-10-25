var express = require('express');
var router = express.Router();
const fs = require('fs'); //filesync
const crypto = require("crypto");
const { body, validationResult } = require('express-validator');
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
router.get('/', function(req, res) {
    res.render('register', { config: config });
});
router.post('/', body('username').not().isEmpty().trim().escape(), body('email').isEmail().normalizeEmail().optional({checkFalsy: true}), function(req, res) {
    if(config.accounts.registration.enabled == false) { //if registration is disabled
        res.render('register', { config: config, error: "Registration is disabled." });
    }
    if(config.accounts.registration.requireEmail == true && req.body.email == "") { //if email is required and not provided
        res.render('register', { config: config, error: "Email is required." });
    }
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;
    if(username == "" || password == "" || password2 == "") { //if any fields are empty
        res.render('register', { config: config, error: "Please fill out all fields." });
    }
    let email = null;
    if(req.body.email != "") {
        email = req.body.email;
    }
    if(password != password2) { //Passwords do not match
        res.render('register', { config: config, error: "Passwords do not match" });
    }
    password = crypto.createHash('sha256').update(password+config['server']['salt']).digest('base64'); //Hash password
    let sql = `INSERT INTO users (username, password, email) VALUES (NULL, 0, '${username}', '${password}', ${Date.now()})`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/login'); //Redirect to login page
    });
});
module.exports = router;
