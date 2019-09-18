var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userModel = require('../models/user');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    var ls = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            userModel.findByUsername(username).then(rows => {
                if (rows == null) {
                    return done(null, false, { message: 'Invalid username' });
                }

                var user = rows;
                if (password.localeCompare(user.password) == 0) {
                    return done(null, user);
                }

                return done(null, false, { message: 'Invalid password' });
            })
                .catch(err => {
                    return done(err, false);
                })
        });

    passport.use(ls);

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}