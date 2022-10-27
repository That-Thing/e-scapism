var express = require('express');
var router = express.Router();
const connection = require('../modules/connection');
const config = require('../modules/config');
const { response, application } = require('express');
const { connect } = require('http2');
const app = require('../app');
const { body, validationResult } = require('express-validator');

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
//Make post
router.post('/:id/post', body('content').not().isEmpty().trim().escape(), function(req, res, next) {
    if(!req.session.loggedIn) {
        return res.redirect('/login');
    }
    let content = req.body.content;
    if(content == "") {
        return res.redirect(`/forums/${req.params.id}`);
    }
    //Check if forum exists
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, rows) {
        if(rows.length > 0) {
            connection.query(`INSERT INTO posts VALUES (NULL, ${req.session.user}, '${req.session.username}', ${req.params.id}, NULL,${Date.now()}, '${content}')`, function (error, result) {
                if (error) throw error;
                res.redirect(`/forums/${req.params.id}/${result.insertId}`); //Redirect user to new thread.
            });
        } else {
            return res.redirect('/forums');
        }
    });
});
//Post page
router.get('/:id/:post', function(req, res, next) {
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, forums) { //Get forum
        if (error) throw error;
        if(forums.length > 0) {
            connection.query(`SELECT * FROM posts WHERE id = ${req.params.post} AND thread IS NULL AND forum=${req.params.id}`, function (error, posts) { //Get thread
                if (error) throw error;
                if(posts.length > 0) {
                    connection.query(`SELECT * FROM posts WHERE thread=${req.params.post}`, function (error, replies) { //Get replies
                        if (error) throw error;
                        res.render('thread', { config: config, forum: forums[0], thread: posts[0], replies: replies, session: req.session });
                    });
                } else {
                    res.redirect('/forums/'+req.params.id);
                }

            });
        
        } else {
            res.redirect('/forums');
        }
    });
});

module.exports = router;