const db = require('../common/database');

module.exports = {

    addNewImgThumbnail: (entity) => {
        return db.add('img_thumbnail', entity);
    },

    deleteImgThumbnailById: (id) => {
        return db.deleteById('img_thumbnail', id);
    },
    deleteAllImgByPostId: (id) => {
        var sql = `delete from img_thumbnail where post_id = ${id}`;
        return db.excute(sql);
    },

    findAll: () => {
        return db.findAll('img_thumbnail');
    },

    findById: (id) => {
        return db.findById('img_thumbnail', id);
    },

    updateImgThumbnail: (entity, id) => {
        return db.update('img_thumbnail', entity, id);
    },

    getAllImgByPostId: (id) => {
        return db.getAllByField('img_thumbnail', 'post_id', id);
    }
}