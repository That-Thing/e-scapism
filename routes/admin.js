const express = require('express');
const router = express.Router();
const config = require('../modules/config');
const connection = require('../modules/connection');
const { body, validationResult } = require('express-validator');
const {writeFile} = require("fs");

router.use(function(req, res, next) {
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
    next();
})


//Get admin page
router.get('/', function(req, res) {
    res.render('admin', { config: config, group: req.session.group, user: req.session.user });
});

//Forum management block

//Manage forums
router.get('/forums', function(req, res) {
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    connection.query(`SELECT * FROM forums`, function (error, result) {
        if (error) throw error;
        res.render('admin-forums', { config: config, group: req.session.group, user: req.session.user, forums: result, error: err });
    });
});
//Edit forum
router.get('/forums/:id', function(req, res) {
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, result) {
        if (error) throw error;
        if(result.length > 0) {
            res.render('admin-forums-edit', { config: config, group: req.session.group, user: req.session.user, forum: result[0], error: err });
        } else {
            res.redirect('/admin/forums');
        }
    });
});
//Add forum
router.post('/forums/new', body('name').not().isEmpty().trim().escape(), body("description").not().isEmpty().trim().escape().isLength({max:256}), body("identifier").not().isEmpty().trim().escape().isLength({max:5}), function(req, res) {
    let name = req.body.name;
    let description = req.body.description;
    let identifier = req.body.identifier;
    if(name == "" || description == "" || identifier == "") { //if any fields are empty
        return res.redirect('/admin/forums?error='+encodeURIComponent("Please fill out all fields."));
    }
    //Check if forum already exists
    connection.query(`SELECT * FROM forums WHERE LOWER(text_identifier) = '${identifier.toLowerCase()}' OR LOWER(name) = '${name.toLowerCase()}'`, function (error, result) {
        if (error) throw error;
        if(result.length > 0) { //Forum already exists
            return res.redirect('/admin/forums?error='+encodeURIComponent("Forum already exists."));
        }
        connection.query(`INSERT INTO forums VALUES (NULL, '${identifier}', ${Date.now()}, ${req.session.user}, '${name}', '${description}')`, function (error, result) {
            if (error) throw error;
            res.redirect('/admin/forums');
        });
    });
});
//Edit forum
router.post('/forums/:id/edit', body('name').not().isEmpty().trim().escape(), body("description").not().isEmpty().trim().escape().isLength({max:256}), body("identifier").not().isEmpty().trim().escape().isLength({max:5}), function(req, res) {
    let name = req.body.name;
    let description = req.body.description;
    let identifier = req.body.identifier;
    if(name == "" || description == "" || identifier == "") { //if any fields are empty
        return res.redirect('/admin/forums/'+req.params.id+'?error='+encodeURIComponent("Please fill out all fields."));
    }
    connection.query(`UPDATE forums SET text_identifier = '${identifier}', name = '${name}', description = '${description}' WHERE id = ${req.params.id}`, function (error, result) {
        if (error) throw error;
        res.redirect('/admin/forums');
    });
});
//Delete forum
router.get('/forums/:id/delete', function(req, res) {
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    connection.query(`DELETE FROM forums WHERE id = ${req.params.id}`, function (error, result) {
        if (error) throw error;
        //Delete all posts in forum
        connection.query(`DELETE FROM posts WHERE forum = ${req.params.id}`, function (error, result) {
            if (error) throw error;
            res.redirect('/admin/forums');
        });
    });
});

// User management block

//Manage users
router.get('/users', function(req, res) {
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    connection.query(`SELECT * FROM accounts`, function (error, result) {
        if (error) throw error;
        res.render('admin-users', { config: config, group: req.session.group, user: req.session.user, users: result, error: err });
    });
});
//Edit user
router.get('/users/:id', function(req, res) {
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    connection.query(`SELECT * FROM accounts WHERE id = ${req.params.id}`, function (error, result) {
        if (error) throw error;
        if(result.length > 0) {
            res.render('admin-users-edit', { config: config, group: req.session.group, user: req.session.user, user: result[0], error: err });
        } else {
            res.redirect('/admin/users');
        }
    });
});
//Edit user
router.post('/users/:id/edit', body('username').not().isEmpty().trim().escape(), body("email").optional({checkFalsy: true}).trim().escape().isEmail(), body("group").not().isEmpty().trim().escape().isInt(), function(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    if (email == "") {
        email = null;
    }
    let group = req.body.group;
    if(username == "" || group == "") { //if any fields are empty
        return res.redirect('/admin/users/'+req.params.id+'?error='+encodeURIComponent("Please fill out all fields."));
    }
    connection.query(`UPDATE accounts SET username = '${username}', email = '${email}', group = ${group} WHERE id = ${req.params.id}`, function (error, result) {
        if (error) throw error;
        res.redirect('/admin/users');
    });
});
//Delete user
router.get('/users/:id/delete', function(req, res) {
    connection.query(`DELETE FROM accounts WHERE id = ${req.params.id}`, function (error, result) {
        if (error) throw error;
        res.redirect('/admin/users');
    });
});

router.get('/settings', function(req, res) {
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    res.render('admin-settings', { config: config, group: req.session.group, user: req.session.user, error: err });
});
router.post('/settings/update',
    body("name").not().isEmpty().trim().escape(),
    body("description").not().isEmpty().trim().escape(),
    body("logo").not().isEmpty().trim().escape(),
    body("favicon").not().isEmpty().trim().escape(),
    //Registration
    body("registrations").not().isEmpty().trim().escape().isBoolean(),
    body("require-email").not().isEmpty().escape().isBoolean(),
    body("email-confirmation").not().isEmpty().escape().isBoolean(),
    //Threads
    body("thread-wordcount").not().isEmpty().escape().isBoolean(),
    body("thread-minimum-words").not().isEmpty().isNumeric(),
    body("thread-maximum-words").not().isEmpty().isNumeric(),
    body("thread-max-chars").not().isEmpty().isNumeric(),
    //Posts
    body("post-wordcount").not().isEmpty().escape().isBoolean(),
    body("post-minimum-words").not().isEmpty().isNumeric(),
    body("post-maximum-words").not().isEmpty().isNumeric(),
    body("post-max-chars").not().isEmpty().isNumeric(),
    function(req, res) {
        //Write information to config.json file
        config.branding.name = req.body.name;
        config.branding.description = req.body.description;
        //config.branding.logo = req.body.logo;
        //config.branding.favicon = req.body.favicon;
        //Registration
        req.body.registration == "true" ? config.accounts.registration.enabled = true : config.accounts.registration.enabled = false;
        req.body['require-email'] == "true" ? config.accounts.registration.requireEmail = true : config.accounts.registration.requireEmail = false;
        req.body['email-confirmation'] == "true" ? config.accounts.registration.requireEmailConfirmation = true : config.accounts.registration.requireEmailConfirmation = false;
        //Threads
        req.body['thread-wordcount'] == "true" ? config.posts.wordCount.threads.enabled = true : config.posts.wordCount.threads.enabled = false;
        config.posts.wordCount.threads.minimum = parseInt(req.body['thread-minimum-words']);
        config.posts.wordCount.threads.maximum = parseInt(req.body['thread-maximum-words']);
        config.posts.wordCount.threads.maxChars = parseInt(req.body['thread-max-chars']);
        //Posts
        req.body['post-wordcount'] == "true" ? config.posts.wordCount.replies.enabled = true : config.posts.wordCount.replies.enabled = false;
        config.posts.wordCount.replies.minimum = parseInt(req.body['post-minimum-words']);
        config.posts.wordCount.replies.maximum = parseInt(req.body['post-maximum-words']);
        config.posts.wordCount.replies.maxChars = parseInt(req.body['post-max-chars']);
        //Write to file
        writeFile('./config/config.json', JSON.stringify(config, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
            res.redirect('/admin/settings?success='+encodeURIComponent("Settings updated successfully."));
        });



});




module.exports = router;