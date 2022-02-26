const User = require("../model/user");
const { verifyPin } = require( "../helper/hash")
const { generateToken } = require( "../helper/token");
const { token } = require("morgan");


const Register = async (req, res) => {
    console.log("bbody",req.body)
    const {first_name, last_name, phone_number, address, pin} = req.body
    try {
        const result = await User.create({
            first_name, last_name, phone_number, address, pin
        })
        if(result) {
            const payloadResult = {
                status: "SUCCESS",
                result: {
                    user_id: result.user_id,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    phone_number: result.phone_number,
                    address: result.address,
                    created_date: result.created_date
                }
            }
            res.status(200).json(payloadResult)
        }
    } catch(err) {
        res.status(400).json({
            message: "Phone Number already registered"
        })
    }
}

const Login = async (req, res) => {
    try {
        const {pin, phone_number} = req.body
        const result = await User.findOne({phone_number})
        const isVerified = await verifyPin(pin, result.pin)
        if(isVerified) {
            console.log("result login", result, isVerified)
            const token = await generateToken({
                user_id: result.user_id,
                phone_number: result.phone_number
            })
            res.status(200).json({
                status: "SUCCESS",
                result: {
                    access_token: token,
                    refreshToken: token
                }
            })
        }

    } catch (err) {
        res.status(400).json({
            message: 'Phone number and pin doesn’t match'
        })
    }

}

module.exports = {
    Register,
    Login
}