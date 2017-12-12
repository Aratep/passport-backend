const db = require('../db');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = db.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    hash_password: String,
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'})

const users = db.model('user', UserSchema);

module.exports = users;
