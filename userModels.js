const mongoose = require('mongoose');

const userschema = mongoose.Schema({
    ID: Number,
    name: String,
    email: String,
    password: String,
    picture: String,
    loginID: Number,
    isCreator: Boolean,
    votes: [
        {
            postID: Number,
            voteType: { type: String, enum: ['upvote', 'downvote'] }, // Vote type (upvote or downvote)
        }
    ]
});

module.exports = mongoose.model("users", userschema);