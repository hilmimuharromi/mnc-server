const bcrypt = require( "bcryptjs");

const hashPin = (pin) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pin, salt);
}

const verifyPin = (pin, hash) => {
    return bcrypt.compareSync(pin, hash)
}
module.exports = { hashPin, verifyPin }