//Schemas (Users, Forums, Posts)

const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    ID: Number,
    name: String,
    email: String,
    password: String,
    picture:String,
    loginID:Number,
    isCreator: Boolean
})

module.exports = mongoose.model("users", userschema)

