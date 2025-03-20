//Schemas (Users, Forums, Posts)

const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    ID: Number,
    name: String,
    email: String,
    password: String,
    isCreator: Boolean,
    picture:String,
    loginID:Number
})

module.exports = mongoose.model("users", userschema)

