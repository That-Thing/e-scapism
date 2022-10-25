var express = require('express');
var router = express.Router();
const config = require('../modules/config');
const connection = require('../modules/connection');


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






module.exports = router;