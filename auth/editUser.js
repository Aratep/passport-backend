const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const User = require('../models/schemas/users');

router.edit_user = (req, res, next) => {
    const username = req.body.values.usernameupdate;
    const email = req.body.values.emailupdate;
    const id = req.body.id;
    const userId = localStorage.getItem('userId');

    User.findOne({_id: id})
        .then(user => {
            if (userId !== id) {

                res.status(401).send({message: 'You have no permissions to edit this user'})
                return
            }
            if (user) {
                User.updateOne(
                    {_id: id},
                    {$set: {username: username, email: email, created: Date.now()}},
                    {runValidators: true, context: 'query'}
                )
                    .then(() => {
                            res.status(200).json({
                                    token: jwt.sign(
                                        {email: email, username: username, _id: user._id}, 'secret_key')
                                }
                            );
                        }
                    )
                    .catch(err => {
                        for (let i in err.errors) {
                            return res.status(400).send({
                                message: err.errors[i].message
                            });
                        }
                    })
            }
        })
        .catch(err => console.log(err));
};

module.exports = router;