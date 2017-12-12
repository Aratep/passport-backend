const jwt = require('jsonwebtoken');
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function generateToken() {
    const token = jwt.sign({token: 'supersecret token'}, 'secret_key');
    localStorage.setItem('_token', token);
    return token
}

module.exports = generateToken;
