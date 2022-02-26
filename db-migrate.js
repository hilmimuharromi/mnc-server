const mongoose = require('mongoose')
const User = require('./src/model/user')
const Transaction = require('./src/model/transaction')
const { v4: uuidv4 } = require('uuid');

mongoose
    .connect('mongodb://localhost:27017/mnc-test')
    .then(x => {
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
    })
    .catch(err => {
        console.error("Error connecting to mongo", err);
    });


const migrateNow = async () => {
    const resUser = await User.deleteMany()
    const resTransaction = await Transaction.deleteMany()
    console.log('remove all users', resUser)
    console.log('remove all transactions', resTransaction)
    if(resUser && resTransaction) {
        insertUser()
    }
}

const insertUser = async () => {
    const result = await User.insertMany([
        {
            "first_name": "toni", 
            "last_name": "Saja", 
            "phone_number": "08123321100", 
            "address": "Jl. Kebon Sirih No. 11",
            "pin": "123456",
            "balance": 1000000,
            user_id: uuidv4()
        },
        {
            "first_name": "Kevin", 
            "last_name": "Nivek", 
            "phone_number": "0812332999", 
            "address": "Jl. Kebon Nanas No. 1",
            "pin": "123456",
            "balance": 2500000,
            user_id: uuidv4()
        },
        {
            "first_name": "Surya", 
            "last_name": "Sakti", 
            "phone_number": "0812332002", 
            "address": "Jl. Kebon Pisang No. 60",
            "pin": "123456",
            "balance": 1500000,
            user_id: uuidv4()
        }
    ])
    if(result) {
        console.log('insert users', result)
        await transfer(result[0], result[1])
        await topUp(result[2])
        await payment(result[2])
    }
}

const topUp = async (user) => {
    const amount = 500000
    const result = await  User.updateOne({
        user_id:  user.user_id
    }, {
        $inc :{balance: amount}
    })
    if(result) {
        const top_up_id = uuidv4()
        const resTransaction = await Transaction.create({
            top_up_id,
                balance_before: user.balance,
                balance_after: user.balance + amount,
                amount,
                status: "SUCCESS",
                user_id: user.user_id,
                remarks: "",
                transaction_type: "CREDIT"
        })
        return console.log(`top up user ===>`, resTransaction)
    }
}

const payment = async (user) => {
    const amount = 10000
    const result = await  User.updateOne({
        user_id:  user.user_id
    }, {
        $inc :{balance: - amount}
    })
    if(result) {
        const top_up_id = uuidv4()
        const resTransaction = await Transaction.create({
            top_up_id,
                balance_before: user.balance,
                balance_after: user.balance - amount,
                amount,
                status: "SUCCESS",
                user_id: user.user_id,
                remarks: "Beli Pulsa",
                transaction_type: "DEBIT"
        })
        return console.log(`payment ===>`, resTransaction)
    }
}

const transfer =  async (user, target_user) => {
    const amount = 200000
    console.log('masuuuk', target_user)
    const resUser = await User.updateOne({
        user_id: user.user_id
    }, {
        $inc:{ balance: - amount}
    })
    const resTarget = await User.updateOne({
        user_id: target_user.user_id
    }, {
        $inc:{ balance: + amount}
    })
    if(resUser && resTarget) {
        const transfer_id = uuidv4()
        const resTransaction = await Transaction.create({
            transfer_id,
            balance_before: user.balance,
            balance_after: user.balance - amount,
            amount,
            remarks: "Bayar Arisan",
            status: "SUCCESS",
            user_id: user.user_id,
            transaction_type: "DEBIT"
        })
        console.log(`transfer user ===>`, resTransaction)
    }

}

migrateNow()
