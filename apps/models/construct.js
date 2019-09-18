const db = require('../common/database');


module.exports = {

    addNewConstruct: (entity) => {
        return db.add('constructs', entity);
    },

    deleteConstructById: (id) => {
        return db.deleteById('constructs', id);
    },

    findAll: () => {
        return db.findAll('constructs');
    },

    findById: (id) => {
        return db.findById('constructs', id);
    },

    updateConstruct: (entity, id) => {
        return db.update('constructs', entity, id);
    },

    getAllConstructByCatId: (id) => {
        return db.getAllByField('constructs', 'cat_id', id);
    },

    changeStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            var sql = `UPDATE constructs set status=? WHERE id = ?`;
            var conn = db.getConnection();
            conn.connect();
            conn.query(sql, [status, id], (err, value) => {
                if (err) reject(err);
                else resolve(value[0]);
                conn.end();
            })
        })
    },
    getConstructThumb: (limit, offset) => {
        var sql = `select c.*, i.url from constructs c left join img_construct i on c.id = i.construct_id group by (c.id) limit ${limit} offset ${offset}`;
        return db.excute(sql);
    },
    countPage: () =>{
        var sql = `SELECT COUNT(*) as total from constructs`;
        return db.excute(sql);
    }
}