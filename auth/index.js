const reset = require('./resetPassword');
const edit = require('./editUser');
const remove = require('./removeUser');
const allUsers = require('./getAllUsersList');

const auth = {
    reset,
    edit,
    remove,
    allUsers
};

module.exports = auth;
