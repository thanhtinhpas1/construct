const express = require('express');
var router = express.Router();
const userDB = require('../../models/user');

router.get('/', (req, res) => {
    userDB.getAllUser().then(values => {
        res.render('admin/users', { layout: 'admin/baseview', users: values });
    }).catch(err => {
        console.log(err);
    })
})

router.post('/add', (req, res) => {
    var entity = req.body;
    entity.role_id = 1;
    userDB.addNewUser(entity).then(values => {
        if (values) {
            res.redirect('/admin/users');
        }
    }).catch(err => {
        console.log(err);
    })
})


router.get('/:id/update', (req, res) => {
    var id = req.params.id;
    userDB.findById(id).then(values => {
        res.render('admin/update_user', { layout: 'admin/baseview', user: values });
    }).catch(err => {
        console.log(err);
    })
})

router.post('/:id/update', (req, res) => {
    var entity = req.body;
    var id = req.params.id;
    userDB.findById(id).then(value => {
        entity['id'] = value.id;
        entity['created_at'] = value.created_at;
        entity['updated_at'] = value.updated_at;
        userDB.updateUser(entity).then(values => {
            console.log(values);
            console.log('Update success');
            if (value) {
                res.redirect('/admin/users');
            }
        }).catch(err => {
            console.log('Update failed ' + err);
            res.redirect('/admin/users');
        })
    }).catch(err => {
        console.log('Update failed ' + err);
        res.redirect('/admin/users');
    })
})

router.post('/:id/delete', (req, res) => {
    var id = req.params.id;
    userDB.deleteUserById(id).then(value => {
        if (value) res.redirect('/admin/users');
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;