const login = require('./login');
const signup = require('./signup');
const User = require('../models/schemas/users');
const jwt = require('jsonwebtoken');

function initialize (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ');
        // done(null, user)
        jwt.verify(user, 'secret_key', (err, decodedUser) => {
            if (err) console.log(err);
            console.log(decodedUser + '============================');
            done(null, decodedUser._id);
        })
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            console.log('deserializing user:');
            console.log(user);
            const token = jwt.sign({token: user}, 'secret_key');
            done(err, token);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}

module.exports = initialize;
