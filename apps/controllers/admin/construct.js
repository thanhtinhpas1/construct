const expess = require('express');
const construct = require('../../models/construct');
const imgConstruct = require('../../models/img_construct');

var router = expess.Router();

router.get('/', (req, res) => {
    construct.findAll().then(values => {
        res.render('admin/construct', { layout: 'admin/baseview', constructs: values });
    }).catch(err => {
        console.log(err);
    })
})

router.post('/add', (req, res) => {
    construct.addNewConstruct(req.body).then(values => {
        if (values) {
            res.redirect('/admin/construct');
        }
    }).catch(err => {
        console.log(err);
    })
})

router.get('/change-status/:id', (req, res) => {
    var id = req.params.id;
    var status = req.query.status;
    construct.changeStatus(id, status).then(values => {
        console.log('Change status success!');
        res.redirect('/admin/construct');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/construct');
    })
})


router.get('/:id/update', (req, res) => {
    var id = req.params.id;
    construct.findById(id).then(values => {
        res.render('admin/update_construct', { layout: 'admin/baseview', construct: values });
    }).catch(err => {
        console.log(err);
    })
})

router.post('/:id/update', (req, res) => {
    var entity = req.body;
    var id = req.params.id;
    construct.findById(id).then(value => {
        value.name = entity.name;
        value.address = entity.address;
        value.client = entity.client;
        value.value = entity.value;
        value.year = entity.year;
        construct.updateConstruct(value, id).then(values => {
            console.log(values);
            console.log('Update success');
            if (value) {
                res.redirect('/admin/construct');
            }
        }).catch(err => {
            console.log('Update failed ' + err);
            res.redirect('/admin/construct');
        })
    }).catch(err => {
        console.log('Update failed ' + err);
        res.redirect('/admin/construct');
    })
})

router.post('/:id/delete', (req, res) => {
    var id = req.params.id;
    imgConstruct.deleteAllImgByConstructId(id).then(value => {
        construct.deleteConstructById(id).then(value => {
            if (value) res.redirect('/admin/construct');
        }).catch(err => {
            console.log(err);
            res.redirect('/admin/construct');
        })
    }).catch(err => {
        console.log(err);
    })

})

router.get('/:id/upload', (req, res) => {
    var id = req.params.id;
    imgConstruct.getAllImgByConstructId(id).then(values => {
        res.render('admin/upload-image', { layout: false, id: req.params.id, imgs: values });
    }).catch(err => {
        console.log(err);
    })
})


// UPLOAD IMAGE
var multer = require('multer');

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
        cb(null, `./public/admin/images/construct/`);
    },
})
var upload = multer({ storage });

router.post('/:id/upload', upload.array('fuMain'), (req, res, next) => {
    var id = req.params.id;
    var prefix = "public";
    if (req.files) {
        for (let index = 0; index < req.files.length; index++) {
            const file = req.files[index];
            var path = file.path.substr(prefix.length);
            var entity = {};
            entity.construct_id = id;
            entity.url = path;
            imgConstruct.addNewImgConstruct(entity).then(value => {
                console.log('Add new image success');
            }).catch(err => {
                console.log(err);
            })
        }
        res.json(200);
    }
    else {
        res.redirect('/admin/construct');
    }
})

router.post('/photo/:id/delete', (req, res) => {
    var id = req.params.id;
    var construtId = req.query.action;
    imgConstruct.deleteImgConstructById(id).then(value => {
        if (value) res.redirect('/admin/construct/' + construtId + '/upload');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/construct');
    })
})

module.exports = router;