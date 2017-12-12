const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const User = require('../models/schemas/users');

router.sign_up = (req, res, next) => {
    const username = req.body.usernamesignup;
    const email = req.body.emailsignup;
    const password = req.body.passwordsignup_confirm;
    const userToRegister = {
        username, email, hash_password: password
    };
    const newUser = new User(userToRegister);
    newUser.hash_password = bcrypt.hashSync(password, 10);

    newUser.save()
        .then((user) => {
            user.hash_password = undefined;
            return res.json(user);
        })
        .catch(err => {
            for (let i in err.errors) {
                return res.status(400).send({
                    message: err.errors[i].message
                });
            }
        })
};

module.exports = router;