
var db = require("../common/database");

function updateCategory(entity) {
    return db.update('categories', entity);
}

function getAllCategory() {
    return db.findAll("categories");
}

function deleteCatById(id){
    return db.deleteById("categories", id);
}

function addNewCategory(entity) {
    return db.add("categories", entity);
}

function findCategoryById(id){
    return db.findById("categories",id);
}

module.exports = {
    getAllCategory: getAllCategory,
    deleteCatById: deleteCatById, 
    addNewCategory: addNewCategory,    
    findCategorybyId: findCategoryById,
    updateCategory: updateCategory,
}