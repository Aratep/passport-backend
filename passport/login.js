const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const LocalStrategy = require('passport-local').Strategy;
// const passport = require('passport');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const User = require('../models/schemas/users');


router.sign_in = function (passport) {

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            console.log('req.body from login form');
            console.log(req.body);

            User.findOne({$or: [{'email': username}, {'username': username}]})
                .then(user => {
                    if (!user) {
                        // res.status(401).json({message: 'Authentication failed. User not found.'})
                        return done(null, false,
                            req.flash('message', 'Authentication failed. User Not found.'));

                    } else if (user) {
                        if (user && !bcrypt.compareSync(password, user.hash_password)) {
                            // res.status(401).json({message: 'Authentication failed. Wrong password.'})
                            return done(null, false,
                                req.flash('message', 'Authentication failed. Wrong password.'));
                        }
                    }
                    if (user && bcrypt.compareSync(password, user.hash_password)) {
                        localStorage.setItem('userId', user._id);

                        const token = jwt.sign({
                            email: user.email,
                            username: user.username,
                            _id: user._id,
                            isLoggedin: true
                        }, 'secret_key');
                        // res.status(200).json({token: token})
                        return done(null, token);
                    }
                })
                .catch(err => console.log(err))
        })
    );
};

// router.sign_in = (req, res, next) => {
//     // console.log(req.body)
//     const username = req.body.values.username;
//     const email = req.body.values.username;
//     const password = req.body.values.password;
//
//     User.findOne({$or: [{'email': email}, {'username': username}]})
//         .then(user => {
//             if (!user) {
//                 res.status(401).json({message: 'Authentication failed. User not found.'})
//
//             } else if (user) {
//                 if (user && !bcrypt.compareSync(password, user.hash_password)) {
//                     res.status(401).json({message: 'Authentication failed. Wrong password.'})
//                 }
//             }
//             if (user && bcrypt.compareSync(password, user.hash_password)) {
//                 req.session.userId = user._id;
//                 localStorage.setItem('userId', user._id);
//
//                 const token = jwt.sign({
//                     email: user.email,
//                     username: user.username,
//                     _id: user._id,
//                     isLoggedin: true
//                 }, 'secret_key');
//                 res.status(200).json({token: token})
//             }
//         })
//         .catch(err => console.log(err))
// };

module.exports = router;