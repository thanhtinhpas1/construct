var config = require('config');
var mysql = require('mysql');
var utils = require('../helpers/helper')

function createConnection() {
    return mysql.createConnection({
        host: config.get('mysql.host'),
        user: config.get('mysql.user'),
        password: config.get('mysql.password'),
        database: config.get('mysql.database'),
        timeout: config.get('mysql.timeout'),
        port: config.get('mysql.port'),
    });
}

module.exports = {
    getConnection: () => {
        var connection = createConnection();
        if (connection != null) {
            console.log('Connect db success');
            return connection;
        }
        console.log('Failed connect to db');
        return null;
    },
    update: (tableName, entity) => {
        return new Promise((resolve, reject) => {
            var sql = `UPDATE ${tableName} set ? WHERE id = ?`;
            var conn = createConnection();
            conn.connect();
            entity["updated_at"] = utils.GetTimeNow();
            conn.query(sql, [entity, entity.id], (err, value) => {
                if (err) reject(err);
                else resolve(value[0]);
                conn.end();
            })
        })
    },
    deleteById: (tableName, id) => {
        return new Promise((resolve, reject) => {
            var sql = `DELETE from ${tableName} WHERE id=?`;
            var conn = createConnection();
            conn.connect();
            conn.query(sql, id, (err, value) => {
                if (err) reject(err);
                else resolve(value);
                conn.end();
            });
        })
    },
    //Find all table in db
    findAll: (tableName) => {
        return new Promise((resolve, reject) => {
            var sql = `SELECT * from ${tableName}`;
            var conn = createConnection();
            conn.connect();
            conn.query(sql, (err, value) => {
                if (err) reject(err);
                else resolve(value);
                conn.end();
            });
        })
    },
    findById: (tableName, id) => {
        return new Promise((resolve, reject) => {
            var sql = `SELECT * from ${tableName} WHERE id = ?`;
            var conn = createConnection();
            conn.connect();
            conn.query(sql, id, (err, value) => {
                if (err) reject(err);
                else {
                    resolve(value[0]);
                }
                conn.end();
            });
        });
    },
    findOne: (tableName, field, username) => {
        console.log(username);
        return new Promise((resolve, reject) => {
            var sql = `SELECT * from ${tableName} WHERE ${field} = ?`;
            var conn = createConnection();
            conn.connect();
            conn.query(sql, username, (err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value[0]);
                }
                conn.end();
            });
        });
    },
    add: (tableName, entity) => {
        return new Promise((resolve, reject) => {
            var sql = `insert into ${tableName} set ?`;
            var conn = createConnection();
            conn.connect();
            entity["created_at"] = utils.GetTimeNow();
            entity["updated_at"] = utils.GetTimeNow();
            conn.query(sql, entity, (error, value) => {
                if (error) reject(error);
                else {
                    resolve(value);
                }
                conn.end();
            });
        });
    },
    getAllByField: (tableName, field, value) => {
        return new Promise((resolve, reject) => {
            var sql = `select * from ${tableName} where ${field}=${value}`;
            var conn = createConnection();
            conn.connect();
            conn.query(sql, (err, values) => {
                if (err) reject(err);
                else resolve(values);
                conn.end();
            });
        })
    },
    excute: (sql) => {
        return new Promise((resolve, reject) => {
            var conn = createConnection();
            conn.connect();
            conn.query(sql, (err, values) => {
                if (err) reject(err);
                else resolve(values);
                conn.end();
            });
        })
    }
}