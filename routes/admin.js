var express = require('express');
var router = express.Router();
const config = require('../modules/config');
const connection = require('../modules/connection');
const { body, validationResult } = require('express-validator');

//Get admin page
router.get('/', function(req, res) {
    if(!req.session.loggedIn) { //If user not logged in
        return res.redirect('/login');
    }
    if(req.session.group < 1) { //If user is not admin
        return res.redirect('/');
    }
    res.render('admin', { config: config, group: req.session.group, user: req.session.user });
});

//Forum management block

//Manage forums
router.get('/forums', function(req, res) {
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
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
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
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
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
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
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
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
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
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
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
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
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
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
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
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
    let err = null
    if(req.query.error) {
        err = req.query.error;
    }
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
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
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
    res.render('admin-settings', { config: config, group: req.session.group, user: req.session.user, error: err });
});



module.exports = router;