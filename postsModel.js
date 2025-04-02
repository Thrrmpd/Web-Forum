const mongoose = require("mongoose");

// Embed comment schema to a post
const commentschema = mongoose.Schema({
  commentID: Number,
  userID: Number,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const postsschema = mongoose.Schema({
  postID: Number,
  filename: String,
  description: String,
  title: String,
  type: String,
  creatorID: Number,
  comments: [commentschema],
  forID: Number,
});

module.exports = mongoose.model("posts", postsschema);
