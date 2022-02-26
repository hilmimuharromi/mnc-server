const jwt = require( "jsonwebtoken")
require('dotenv').config()

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_KEY)
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.TOKEN_KEY)
}

module.exports ={ verifyToken, generateToken }