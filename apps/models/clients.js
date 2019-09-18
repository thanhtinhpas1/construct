var db = require("../common/database");

function getAllClient() {
    return db.findAll("clients");
}

function addNewClient(entity) {
    return db.add("clients", entity);
}

module.exports = {
    getAllClient: getAllClient,
    addNewClient: addNewClient
}