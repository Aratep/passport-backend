const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const User = require('../models/schemas/users');

router.list_all_users = (req, res, next) => {
    User.find({}).exec((err, users) => {
        if (err) throw err;
        User.count().then(count => {
            const token = jwt.sign({users: users, countOfUsers: count}, 'secret_key');
            res.status(200).json({
                token: token
            })
        })
    })
};

module.exports = router;