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
//Manage forums
router.get('/forums', function(req, res) {
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
    connection.query(`SELECT * FROM forums`, function (error, result) {
        if (error) throw error;
        res.render('admin-forums', { config: config, group: req.session.group, user: req.session.user, forums: result });
    });
});
//Edit forum
router.get('/forums/:id', function(req, res) {
    let error = null
    if(req.query.error) {
        error = req.query.error;
    }
    if(!req.session.loggedIn || req.session.group < 1) {
        return res.redirect('/');
    }
    connection.query(`SELECT * FROM forums WHERE id = ${req.params.id}`, function (error, result) {
        if (error) throw error;
        if(result.length > 0) {
            res.render('admin-forums-edit', { config: config, group: req.session.group, user: req.session.user, forum: result[0], error: error });
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
    connection.query(`INSERT INTO forums VALUES (NULL, '${identifier}', ${Date.now()}, ${req.session.user}, '${name}', '${description}')`, function (error, result) {
        if (error) throw error;
        res.redirect('/admin/forums');
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





module.exports = router;