const express = require('express');
const posts = require('../../models/posts');
const thumbImg = require('../../models/img_thumbnail');
const client = require('../../models/clients');

var router = express.Router();

router.use('/users', require(__dirname + '/users'));

router.get('/clients', (req, res) => {
    client.getAllClient().then(values => {
        res.render('admin/clients', { layout: 'admin/baseview', clients: values });
    }).catch(err => {
        console.log(err);
    })
})


router.get('/post/:id/upload', (req, res) => {
    var id = req.params.id;
    thumbImg.getAllImgByPostId(id).then(values => {
        res.render('admin/upload-thumbnail', { layout: false, id: req.params.id, imgs: values });
    }).catch(err => {
        console.log(err);
    })
})


// UPLOAD IMAGE
var multer = require('multer');

var storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    },
    destination: function(req, file, cb) {
        cb(null, `./public/admin/images/post/`);
    },
})
var upload = multer({ storage });

router.post('/post/photo/:id/delete', (req, res) => {
    var id = req.params.id;
    var construtId = req.query.action;
    thumbImg.deleteImgThumbnailById(id).then(value => {
        if (value) res.redirect('/admin/post/' + construtId + '/upload');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin/posts');
    })
})

router.post('/post/:id/upload', upload.array('fuMain'), (req, res, next) => {
    var id = req.params.id;
    var prefix = "public";
    if (req.files) {
        for (let index = 0; index < req.files.length; index++) {
            const file = req.files[index];
            var path = file.path.substr(prefix.length);
            var entity = {};
            entity.post_id = id;
            entity.url = path;
            thumbImg.addNewImgThumbnail(entity).then(value => {
                console.log('Add new image success');
            }).catch(err => {
                console.log(err);
            })
        }
        res.json(200);
    } else {
        res.redirect('/admin/posts');
    }
})

router.get('/posts/add', (req, res) => {
    res.render('admin/writer', { layout: 'admin/baseview' });
});

router.post('/posts/add', (req, res) => {
    var form = req.body;
    posts.addNewPost(form).then(values => {
        console.log('Success add new post');
        res.redirect('/admin');
    }).catch(err => {
        console.log('Failed to add new post: ' + err);
        res.redirect('/admin');
    })
})

router.get('/change-status/:id', (req, res) => {
    var id = req.params.id;
    var status = req.query.status;
    posts.changeStatus(id, status).then(values => {
        console.log('Change status success!');
        res.redirect('/admin');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin');
    })

})

router.get('/post/:id/update', (req, res) => {
    var id = req.params.id;
    var findPost = posts.findById(id);
    Promise.all([findPost]).then(values => {
        res.render('admin/update', { layout: 'admin/baseview', post: values[0] });
    }).catch(err => {
        console.log(err);
    })
})

router.post('/post/:id/update', (req, res) => {
    var entity = req.body;
    var id = req.params.id;
    posts.findById(id).then(value => {
        value.title = entity.title;
        value.content = entity.content;
        value.describe = entity.describe;
        posts.updatePost(value, id).then(values => {
            res.json(200);
        }).catch(err => {
            console.log('Update failed ' + err);
            res.redirect('/admin');
        })
    }).catch(err => {
        console.log('Update failed ' + err);
        res.redirect('/admin');
    })
})

router.post('/post/:id/delete', (req, res) => {
    var id = req.params.id;
    posts.deletePostById(id).then(value => {
        if (value) res.redirect('/admin');
    }).catch(err => {
        console.log(err);
        res.redirect('/admin');
    })
})

router.use('/construct', require(__dirname + '/construct'));

router.get('/', (req, res) => {
    // res.render('admin/index', { layout: 'admin/baseview'});
    posts.findAll().then(values => {
        res.render('admin/index', { layout: 'admin/baseview', posts: values });
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;