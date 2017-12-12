const db = require('mongoose');
const url = 'mongodb://localhost:27017/users';
db.connect(url, {useMongoClient: true});
db.Promise = global.Promise;

module.exports = db;