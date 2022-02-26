const mongoose = require("mongoose") ;
const { hashPin} = require("../helper/hash") 
const { v4: uuidv4 } = require('uuid');
const transactionSchema = new mongoose.Schema({
    transfer_id: {
        type: String,
    },
    top_up_id: {
        type: String,
    },
    payment_id: {
        type: String,
    },
    user_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    transaction_type: {
        type: String,
        required: true,
    }, 
    amount: {
        type: Number,
        required: true,
    },
    remarks: {
        type: String,
    },
    balance_before: {
        type: Number,
        required: true,
    },
    balance_after: {
        type: Number,
        required: true,
    },
}, { timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' } });

// transactionSchema.pre("save", function () {
//     const hashedPin = hashPin(this.pin);
//     this.pin = hashedPin;
// });

const transaction = mongoose.model("transaction", transactionSchema);
module.exports = transaction;