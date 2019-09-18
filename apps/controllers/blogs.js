const express = require('express');
var router = express.Router();
const posts = require('../models/posts');
const moment = require('moment');

router.get('/', (req, res) => {
    //pagination
    var limit = 8;
    var page = req.query.page || 1;
    if (+page < 1) page = 1;
    var offset = (+page - 1) * limit;
    Promise.all([posts.getPage(limit, offset), posts.countPage(), posts.findTop10Recent()]).then(values => {

        var pagination = [];

        //TH
        //1. page <= 5
        //2. page < total - 5
        //3. page >= total - 5
        var total = Math.floor(values[1][0].total / limit);
        console.log(total);
        if (values[1][0].total % limit > 0) total++;
        if (total < 5) {
            for (var i = 1; i <= total; i++) {
                var obj = { value: i };
                if (i == +page) {
                    obj.active = true;
                }
                pagination.push(obj);
            }
        } else if (+page < 3) {
            for (var i = 1; i <= 5; i++) {
                pagination.push({ value: i });
            }
            pagination[+page - 1].active = true;
        } else if (+page < total - 3) {
            pagination.push({ value: 1 });
            pagination.push({ value: '...' });
            pagination.push({ value: +page - 1 });
            pagination.push({ value: page });
            pagination[3].active = true;
            pagination.push({ value: +page + 1 });
            pagination.push({ value: '...' });
            pagination.push({ value: total });
        } else if (+page >= total - 3) {
            pagination.push({ value: 1 });
            pagination.push({ value: '...' });
            for (var i = total - 3; i <= total; i++) {
                var obj = { value: i };
                if (i == +page) {
                    obj.active = true;
                }
                pagination.push(obj);
            }
        }

        //page previous and next
        var previous = false,
            next = false;
        var pagePrevious = +page,
            pageNext = +page;
        if (+page == 1) {
            previous = true;
        } else {
            pagePrevious = +page - 1;
        }
        if (+page == total) next = true;
        else {
            pageNext = +page + 1;
        }

        for (let index = 0; index < values[0].length; index++) {
            const element = values[0][index]['created_at'];
            var check = moment(element, "YYYY/MM/DD");
            var month = parseInt(check.format('M'), 10);
            switch (month) {
                case 1:
                    values[0][index]['month'] = 'JAN';
                    break;
                case 2:
                    values[0][index]['month'] = 'FEB';
                    break;
                case 3:
                    values[0][index]['month'] = 'MAR';
                    break;
                case 4:
                    values[0][index]['month'] = 'APR';
                    break;
                case 5:
                    values[0][index]['month'] = 'MAY';
                    break;
                case 6:
                    values[0][index]['month'] = 'JUN';
                    break;
                case 7:
                    values[0][index]['month'] = 'JUL';
                    break;
                case 8:
                    values[0][index]['month'] = 'AUG';
                    break;
                case 9:
                    values[0][index]['month'] = 'SEP';
                    break;
                case 10:
                    values[0][index]['month'] = 'OCT';
                    break;
                case 11:
                    values[0][index]['month'] = 'NOV';
                    break;
                case 12:
                    values[0][index]['month'] = 'DEC';
                    break;
            }
        }
        res.render('blog', {
            layout: 'baseview',
            posts: values[0],
            recent: values[2],
            pagination,
            previous,
            next,
            pagePrevious,
            pageNext
        })
    }).catch(err => {
        console.log(err);
    })
})

router.get('/:id/detail', (req, res) => {
    var id = req.params.id;
    Promise.all([posts.findById(id), posts.findTop10Recent()]).then(values => {
        const element = values[0][0]['created_at'];
        var check = moment(element, "YYYY/MM/DD");
        var month = parseInt(check.format('M'), 10);
        switch (month) {
            case 1:
                values['month'] = 'JAN';
                break;
            case 2:
                values['month'] = 'FEB';
                break;
            case 3:
                values['month'] = 'MAR';
                break;
            case 4:
                values['month'] = 'APR';
                break;
            case 5:
                values['month'] = 'MAY';
                break;
            case 6:
                values['month'] = 'JUN';
                break;
            case 7:
                values['month'] = 'JUL';
                break;
            case 8:
                values['month'] = 'AUG';
                break;
            case 9:
                values['month'] = 'SEP';
                break;
            case 10:
                values['month'] = 'OCT';
                break;
            case 11:
                values['month'] = 'NOV';
                break;
            case 12:
                values['month'] = 'DEC';
                break;
        }
        res.render('blog-single', {
            layout: 'baseview',
            post: values[0][0],
            recent: values[1]
        })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;