const express = require('express');
const app = express();
const config = require('config');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
var passport = require('passport');
const hbs_sections = require('express-handlebars-sections');
var createError = require('http-errors');
var flash = require("connect-flash");

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
    secret: config.get('secret_key'),
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//static folder
app.use(express.static(__dirname + "/public"));

//set up engine 
app.set("views", __dirname + "/apps/views")
app.set("view engine", "handlebars");

var hbs = require("express-handlebars").create({
    defaultLayout: 'index',
    layoutsDir: __dirname + "/apps/views",
    extname: 'hbs',
    helpers: {
        section: hbs_sections()
    }
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');

//set moment helper for handlebars
var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);

app.use(require('./apps/middlewares/auth-locals.mdw'));
require('./apps/middlewares/session')(app);
require('./apps/middlewares/passport-local')(app);


var controllers = require(__dirname + "/apps/controllers");
app.use(controllers);

// app.use((req, res, next) => {
//     next(createError(404));
// })

// app.use((err, req, res, next) => {
//     var status = err.status || 500;
//     var errorView = '500';
//     if (status === 404)
//         errorView = '404';

//     var msg = err.message;
//     var error = err;
//     console.log(err);
//     console.log(msg);
//     res.status(status).render(errorView, {
//         layout: false,
//         msg,
//         error
//     })
// })

var port = config.get("server.port");

app.listen(process.env.PORT || port, function () {
    console.log("Server is running on port: ", port);
});