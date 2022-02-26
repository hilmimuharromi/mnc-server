const User = require('../model/user')
const {verifyToken} = require('../helper/token')

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            res.status(400).json({
                message: "Unauthenticated"
            })
        } else {
            userTemp = verifyToken(token)
            const isVerified = await User.findOne({
                phone_number :userTemp.phone_number
            })
            if(isVerified) {
                req.user = isVerified
                next()
            }
        }
    } catch(err) {
        res.status(400).json({
            message: "Unauthenticated"
        })
    }

}

module.exports = authentication