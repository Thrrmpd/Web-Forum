const mongoose = require('mongoose')
const postsschema = mongoose.Schema({
    postID:Number,
    filename:String,
    description:String,
    title:String,
    type:String,
    creatorID:Number
})

module.exports = mongoose.model("posts", postsschema)