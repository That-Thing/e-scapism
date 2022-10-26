var express = require('express');
var router = express.Router();
const connection = require('../modules/connection');
const config = require('../modules/config');
const { response, application } = require('express');
const { connect } = require('http2');
const app = require('../app');

//Forum list page
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM `forums`', function (error, rows) {
        res.render('forums', { config: config, forums: rows, group: req.session.group, loggedIn: req.session.loggedIn });
    })
});

//Forum page
router.get('/:id', function(req, res, next) {
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, rows) { //Get forum
        if(rows.length > 0) {
            connection.query(`SELECT * FROM posts WHERE forum=${req.params.id}`, function (error, posts) { //Get posts
                res.render('forum', { config: config, forum: rows[0], posts: posts, group: req.session.group, loggedIn: req.session.loggedIn });
            });
        } else {
            res.redirect('/forums');
        }
    })
});

module.exports = router;