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
            postID: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' }, // Change to ObjectId
            voteType: { type: String, enum: ['upvote', 'downvote'] },
        }
    ]
});

module.exports = mongoose.model("users", userschema);