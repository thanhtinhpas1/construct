var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');

router.get("", function (req, res) {
    res.render("login", { layout: false });
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.render('login', {
                layout: false,
                err_message: info.message
            })
        }

        req.logIn(user, err => {
            if (err) return next(err);
   
            return res.redirect('/admin');
        });
    })(req, res, next);
})

module.exports = router;