const verifyToken = require('./verifyToken');
const accessControls = require('./accesControls');

const middlewares = {
    verifyToken,
    accessControls
}

module.exports = middlewares;