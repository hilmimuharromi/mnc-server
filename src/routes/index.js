const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const trasactionRouter = require('./transactionRouter')

router.use(userRouter)
router.use(trasactionRouter)
router.get("/", (req, res) => {
    res.status(200).json({ message: `server is done` })
})

module.exports = router