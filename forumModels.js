const mongoose = require('mongoose')
const forumschema = mongoose.Schema({
    forID:Number,
    title:String,
    description:String,
    code:String,
    creatorID:Number
})

module.exports = mongoose.model("forums", forumschema)