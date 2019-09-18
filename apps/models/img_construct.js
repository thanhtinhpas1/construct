const db = require('../common/database');

module.exports = {

    addNewImgConstruct: (entity) => {
        return db.add('img_construct', entity);
    },

    deleteImgConstructById: (id) => {
        return db.deleteById('img_construct', id);
    },
    deleteAllImgByConstructId: (id) => {
        var sql = `delete from img_construct where construct_id = ${id}`;
        return db.excute(sql);
    },

    findAll: () => {
        return db.findAll('img_construct');
    },

    findById: (id) => {
        return db.findById('img_construct', id);
    },

    updateImgConstruct: (entity, id) => {
        return db.update('img_construct', entity, id);
    },

    getAllImgByConstructId: (id) => {
        return db.getAllByField('img_construct', 'construct_id', id);
    }
}