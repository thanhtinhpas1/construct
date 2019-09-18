const express = require('express');
var router = express.Router();
const authAdmin = require('../middlewares/auth-admin');
const auth = require('../middlewares/auth');
const construct = require('../models/construct');
const client = require('../models/clients');

router.post('/log-out', (req, res) => {
    req.logOut();
    res.redirect('/');
})

router.post('/clients', (req, res) => {
    client.addNewClient(req.body).then(values => {
        if (values) {
            res.json(200);
        }
    }).catch(err => {
        console.log(err);
    })
})

router.use('/admin', authAdmin, require(__dirname + '/admin/index'));

router.use('/login', auth, require(__dirname + '/login'));

router.use('/projects', require(__dirname + '/projects'));

router.use('/blogs', require(__dirname + '/blogs'));

router.get('/about', (req, res) => {
    res.render('about', { layout: 'baseview' })
})

router.get('/services', (req, res) => {
    res.render('services', { layout: 'baseview' })
});

router.get('/contact', (req, res) => {
    var error = req.query.error;
    var check = false;
    if (error) {
        check = true;
        res.render('contact', { layout: 'baseview', check })
    } else {
        res.render('contact', { layout: 'baseview' })
    }
})

router.get('/', (req, res) => {
    construct.getConstructThumb(10, 0).then(values => {
        res.render('index', { layout: 'baseview', constructs: values })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;