const mongoose = require("mongoose") ;
const { hashPin} = require("../helper/hash") 
const { v4: uuidv4 } = require('uuid');
const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        default: uuidv4()
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    }, 
}, { timestamps: { createdAt: 'created_at' } });

userSchema.pre("save", function () {
    const hashedPin = hashPin(this.pin);
    this.pin = hashedPin;
});

const user = mongoose.model("user", userSchema);
module.exports = user;