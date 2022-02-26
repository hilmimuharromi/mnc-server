const User = require("../model/user");
const Transaction = require('../model/transaction')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')

const TopUp = async (req, res) => {
    try {
        const amount = Number(req.body.amount)
        const currentBalance = req.user.balance + amount

        const result = await User.updateOne({
            user_id: req.user.user_id
        }, {
            balance: currentBalance
        })

        if (result.modifiedCount) {
            const top_up_id = uuidv4()
            const resTransaction = await Transaction.create({
                top_up_id,
                balance_before: req.user.balance,
                balance_after: currentBalance,
                amount,
                status: "SUCCESS",
                user_id: req.user.user_id,
                remarks: "",
                transaction_type: "CREDIT"
            })
            res.status(200).json({
                status: "SUCCESS",
                result: {
                    top_up_id,
                    balance_before: req.user.balance,
                    balance_after: currentBalance,
                    amount_top_up: amount,
                    created_date: moment(resTransaction.created_date).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "Unauthenticated"
        })
    }
}

const Payment = async (req, res) => {
    try {
        const amount = Number(req.body.amount)
        if (req.user.balance < amount) {
            throw new Error('Balance is not enough')
        }
        const currentBalance = req.user.balance - amount
         const result = await User.updateOne({
            user_id: req.user.user_id
        }, {
            balance: currentBalance
        })
        if(result) {
            const payment_id = uuidv4()
            const resPay = await Transaction.create({
                payment_id,
                remarks: req.body.remarks,
                balance_before: req.user.balance,
                balance_after: currentBalance,
                amount,
                status: "SUCCESS",
                user_id: req.user.user_id,
                transaction_type: "DEBIT"
            })
    
            if (resPay) {
                res.status(200).json({
                    status: "SUCCESS",
                    result: {
                        payment_id,
                        amount,
                        remarks: resPay.remarks,
                        balance_before: req.user.balance,
                        balance_after: currentBalance,
                        created_date: moment(resPay.created_date).format('YYYY-MM-DD HH:mm:ss')
                    }
                })
            }
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

const Transfer = async (req, res) => {
    try{
        const {target_user, remarks} = req.body
        const amount = Number(req.body.amount)
        const currentBalance = req.user.balance - amount
        if (req.user.balance < amount) {
            throw new Error('Balance is not enough')
        }
        const transfer_id = uuidv4()
        const resUser = await User.updateOne({
            user_id: req.user.user_id
        }, {
            balance: currentBalance
        })
        const resTarget = await User.updateOne({
            user_id: target_user
        }, {
            $inc:{ balance: + amount}
        })
        if(resUser && resTarget) {
            const resTransaction = await Transaction.create({
                transfer_id,
                remarks: req.body.remarks,
                balance_before: req.user.balance,
                balance_after: currentBalance,
                amount,
                status: "SUCCESS",
                user_id: req.user.user_id,
                transaction_type: "DEBIT"
            })
            res.status(200).json({
                status: "SUCCESS",
                result: {
                    transfer_id,
                    amount,
                    remarks: remarks,
                    balance_before: req.user.balance,
                    balance_after: currentBalance,
                    created_date: moment(resTransaction.created_date).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

const GetTransactions = async (req, res) => {
    try {
        const result = await Transaction.find({
            user_id: req.user.user_id
        }).select({ _id: 1, updatedAt: 0 })
        if(result) {
            res.status(200).json({
                status: 'SUCCESS',
                result
            })
        }
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }

}

module.exports = {
    TopUp,
    Payment, 
    Transfer,
    GetTransactions
}