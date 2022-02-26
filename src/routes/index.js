const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
router.use(userRouter)
router.get("/", (req, res) => {
    res.status(200).json({ message: `server is done` })
})

module.exports = router