const express = require('express');
const router = express.Router();

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const User = require('../models/schemas/users');

router.remove_single_user = (req, res, next) => {
    const id = req.body.id;
    const userId = localStorage.getItem('userId');

    User.findOne({_id: id})
        .then(user => {
            if (userId !== id) {
                res.status(401).send({message: 'You have no permissions to delete this user'})
                return
            }
            if (user) {
                User.remove({_id: id})
                    .then(() => res.status(200).json({message: `${user.username} is deleted`}))
                localStorage.removeItem('_token')
            }
        })
        .catch(err => console.log(err))
};

module.exports = router;