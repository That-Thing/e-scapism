var express = require('express');
var router = express.Router();
const connection = require('../modules/connection');
const config = require('../modules/config');
const { response, application } = require('express');
const { connect } = require('http2');
const app = require('../app');
const { body, validationResult } = require('express-validator');
const { Console } = require('console');

//Check how many words are in a string.
function checkWords (str) {
    return str.split(" ").length;
}
//Check if any markdown is present in a string 
function checkMarkdown(str) {
    str = str.replaceAll("&#x2F;", "/");
    Array.from(str.matchAll(/\*\*\*[^*]+\*\*\*/gm)).forEach((match) => { //Bold Italics
        str = str.replace(match[0], `<b><i>${match[0].substring(3,match[0].length-3)}</i></b>`);
    });
    Array.from(str.matchAll(/\*\*[^*]+\*\*/gm)).forEach((match) => { //Bold
        str = str.replace(match[0], `<b>${match[0].substring(2,match[0].length-2)}</b>`);
    });
    Array.from(str.matchAll(/\*[^*]+\*/gm)).forEach((match) => { //Italics
        str = str.replace(match[0], `<i>${match[0].substring(1,match[0].length-1)}</i>`);
    });
    Array.from(str.matchAll(/\[img](.*)\[\/img]/gm)).forEach((match) => { //Image
        str = str.replace(match[0], `<img class="post-image" src="${match[1].substring(0, match[0].length-5)}">`);
    });
    Array.from(str.matchAll(/\[quote](.*)\[\/quote]/gm)).forEach((match) => { //Quote
        str = str.replace(match[0], `<blockquote>${match[1]}</blockquote>`);
    });
    Array.from(str.matchAll(/\[code](.*)\[\/code]/gm)).forEach((match) => { //Code
        str = str.replace(match[0], `<code>${match[1]}</code>`);
    });
    Array.from(str.matchAll(/\[spoiler](.*)\[\/spoiler]/gm)).forEach((match) => { //Spoiler
        str = str.replace(match[0], `<span class="spoiler">${match[1]}</span>`);
    });
    return str;
}

//Forum list page
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM `forums`', function (error, rows) {
        res.render('forums', { config: config, forums: rows, group: req.session.group, loggedIn: req.session.loggedIn });
    })
});

//Forum page
router.get('/:id', function(req, res, next) {
    if(req.query.error) {
        err = req.query.error;
    } else {
        err = null;
    }
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, rows) { //Get forum
        if(rows.length > 0) {
            connection.query(`SELECT * FROM posts WHERE forum=${req.params.id} AND thread IS NULL ORDER BY creation DESC`, function (error, posts) { //Get posts
                //For each post, get post content
                posts.forEach(post => {
                    post.content = checkMarkdown(post.content);
                });
                res.render('forum', { config: config, forum: rows[0], posts: posts, group: req.session.group, loggedIn: req.session.loggedIn, error: err });
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
    if(content == "") { //if content is empty
        return res.redirect(`/forums/${req.params.id}`);
    }
    if(content.length > config.posts.wordCount.threads.maxChars) { //If post is too long
        return res.redirect(`/forums/${req.params.id}?error=${encodeURIComponent("Character limit exceeded.")}`);
    }
    //Check if forum exists
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, rows) {
        if(rows.length > 0) {
            if(config.posts.wordCount.threads.enabled && checkWords(content) < config.posts.wordCount.threads.minimum) { //If word count is enabled and post is too short
                return res.redirect(`/forums/${req.params.id}?error=${encodeURIComponent("Word count too low. Minimum: "+config.posts.wordCount.threads.minimum)}`);
            }
            if(checkWords(content) > config.posts.wordCount.threads.maximum ) { //If word count is too high
                return res.redirect(`/forums/${req.params.id}?error=${encodeURIComponent("Word count too high. Maximum: "+config.posts.wordCount.threads.maximum)}`);
            }
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
//Reply to post
router.post('/:id/:post/post', body('content').not().isEmpty().trim().escape(), function(req, res, next) {
    if(!req.session.loggedIn) {
        return res.redirect('/login');
    }
    let content = req.body.content;
    if(content == "") {
        return res.redirect(`/forums/${req.params.id}/${req.params.post}`);
    }
    //Check if forum exists
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, rows) {
        if(rows.length > 0) {
            //Check if thread exists
            connection.query(`SELECT * FROM posts WHERE id = ${req.params.post} AND thread IS NULL AND forum=${req.params.id}`, function (error, rows) {
                if(rows.length > 0) {
                    connection.query(`INSERT INTO posts VALUES (NULL, ${req.session.user}, '${req.session.username}', ${req.params.id}, ${req.params.post},${Date.now()}, '${content}')`, function (error, result) {
                        if (error) throw error;
                        res.redirect(`/forums/${req.params.id}/${req.params.post}#${result.insertId}`); //Redirect user to post in thread.
                    });
                } else {
                    return res.redirect('/forums');
                }
            });
        } else {
            return res.redirect('/forums');
        }
    });
});


module.exports = router;