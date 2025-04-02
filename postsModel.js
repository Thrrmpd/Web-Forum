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
  upvotes: { type: Number, default: 0 },  
  downvotes: { type: Number, default: 0 }
});

postsschema.methods.upvote = async function () {
  this.upvotes = this.upvotes || 0;  // Ensure upvotes is at least 0
  this.upvotes += 1;
  await this.save();
};

postsschema.methods.downvote = async function () {
  this.downvotes = this.downvotes || 0;  // Ensure downvotes is at least 0
  this.downvotes += 1;
  await this.save();
};

module.exports = mongoose.model("posts", postsschema);
