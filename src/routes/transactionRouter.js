const express = require('express')
const router = express.Router()
const {TopUp, Payment, Transfer, GetTransactions} = require("../controller/trasactionController")
const authentication = require('../middleware/authentication')

router.post('/topup', authentication, TopUp)
router.post('/pay', authentication, Payment)
router.post('/transfer', authentication, Transfer)
router.get('/transactions', authentication, GetTransactions)
module.exports = router