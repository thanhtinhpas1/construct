var db = require('../common/database');

module.exports = {

    addNewPost: (entity) => {
        return db.add('posts', entity);
    },

    deletePostById: (id) => {
        return db.deleteById('posts', id);
    },

    findAll: () => {
        var sql = `select * from posts`;
        return db.excute(sql);
    },
    findTop10Recent: () => {
        var sql = `select p.*, t.url as thumbnail from posts p left join img_thumbnail t on t.post_id = p.id order by created_at DESC limit 10`;
        return db.excute(sql);
    },

    getPage: (limit, offset) => {
        var sql = `SELECT p.*, t.url as thumbnail from posts p left join img_thumbnail t on t.post_id = p.id LIMIT ${limit} OFFSET ${offset}`;
        return db.excute(sql);
    },

    countPage: () => {
        var sql = `SELECT COUNT(*) as total from posts`;
        return db.excute(sql);
    },

    findById: (id) => {
        var sql = `select p.*, t.url as thumbnail from posts p left join img_thumbnail t on t.post_id = p.id having p.id = ${id}`;
        return db.excute(sql);
    },

    updatePost: (entity, id) => {
        return db.update('posts', entity, id);
    },

    getAllPostByCatId: (id) => {
        return db.getAllByField('posts', 'cat_id', id);
    },

    changeStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            var sql = `UPDATE posts set status=? WHERE id = ?`;
            var conn = db.getConnection();
            conn.connect();
            conn.query(sql, [status, id], (err, value) => {
                if (err) reject(err);
                else resolve(value[0]);
                conn.end();
            })
        })
    },
    findAllThumbnail: (cat_id, limit, offset) => {
        var sql = `select p.id, p.title, p.created_at, p.status, p.thumbnail from posts p where cat_id = ${cat_id} limit ${limit} offset ${offset}`;
        return db.excute(sql);
    },

    getRecent: () => {
        var sql = `select * from posts order by created_at desc limit 5`;
        return db.excute(sql);
    }


}