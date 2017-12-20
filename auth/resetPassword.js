const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const User = require('../models/schemas/users');
const sendVerificationMail = require('../mailer/sendMail');

router.reset_password = (req, res, next) => {
    console.log(req.body);
    const password = bcrypt.hashSync(req.body.passwordreset_confirm, 10);
    const username = req.body.usernamereset;

    User.findOne({$or: [{'email': username}, {'username': username}]})
        .then(user => {
            if (!user) {
                res.status(401).json({message: `${username} is not registered user.`})

            } else if (user) {
                User.updateOne(
                    {$or: [{'email': username}, {'username': username}]},
                    {$set: {hash_password: password, created: Date.now()}}
                )
                    .then(() => {
                        sendVerificationMail(user);
                        res.status(200).json({
                            token: jwt.sign(
                                {email: user.email, username: user.username, _id: user._id},
                                'secret_key')
                        })
                    })
            }
        })
        .catch(err => console.log(err))
};

module.exports = router;