const express = require('express')
const router = express.Router()
const {Register, Login, UpdateProfile} = require("../controller/userController")
const authentication = require('../middleware/authentication')

router.post('/register',Register)
router.post('/login', Login)
router.put('/profile', authentication, UpdateProfile)

module.exports = router