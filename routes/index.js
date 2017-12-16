const express = require('express');
const router = express.Router();
const passport = require('passport');

const generateToken = require('../lib/helperFunctions');
// const login = require('../passport/login');
const register = require('../passport/signup');
const middlewares = require('../middlewares/index');
const auth = require('../auth/index');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

router.get('/token', (req, res, next) => {
    const token = generateToken();
    res.json({token})
});

router.get('/auth/sign_in', (req, res, next) => {
    console.log('req.flash(message)');
    console.log(req.flash('message'));
    res.status(401).json({message: req.flash('message')})
})

router.post('/auth/register', passport.authenticate('signup', {
    successRedirect: '/list_all_users',
    failureRedirect: '/auth/register',
    failureFlash: true
}));
// router.post('/auth/register', register.sign_up);

router.put('/auth/reset_password', auth.reset.reset_password);

router.use(middlewares.verifyToken.verify_token);

router.post('/auth/sign_in', passport.authenticate('login', {
    successRedirect: '/list_all_users',
    failureRedirect: '/auth/sign_in',
    failureFlash: true
}));
// router.post('/auth/sign_in', login.sign_in);

router.put('/auth/edit_user', auth.edit.edit_user);

router.delete('/auth/delete_single_user', auth.remove.remove_single_user);

router.get('/list_all_users', auth.allUsers.list_all_users);


module.exports = router;





