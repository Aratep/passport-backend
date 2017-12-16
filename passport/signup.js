const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const User = require('../models/schemas/users');

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            console.log(req.param('email'));

            createUser = function () {
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
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(createUser);
        })
    );
}


// router.sign_up = (req, res, next) => {
//     const username = req.body.usernamesignup;
//     const email = req.body.emailsignup;
//     const password = req.body.passwordsignup_confirm;
//     const userToRegister = {
//         username, email, hash_password: password
//     };
//     const newUser = new User(userToRegister);
//     newUser.hash_password = bcrypt.hashSync(password, 10);
//
//     newUser.save()
//         .then((user) => {
//             user.hash_password = undefined;
//             return res.json(user);
//         })
//         .catch(err => {
//             for (let i in err.errors) {
//                 return res.status(400).send({
//                     message: err.errors[i].message
//                 });
//             }
//         })
// };

// module.exports = router;