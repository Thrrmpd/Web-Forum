const mongoose = require('mongoose')

const loginschema = mongoose.Schema({
    loginID:Number,
    userID:Number
})

module.exports = mongoose.model("logins", loginschema)