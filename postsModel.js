const mongoose = require("mongoose");
const users = require("./userModels");

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
  downvotes: { type: Number, default: 0 },
  votedUsers: [{ userID: Number, voteType: String }] // Stores who voted and how
});

postsschema.methods.upvote = async function(userID) {
  console.log("Upvoting by user:", userID);

  const existingVote = this.votedUsers.find(vote => vote.userID === userID);
  
  if (existingVote) {
    if (existingVote.voteType === 'upvote') {
      this.upvotes -= 1;
      this.votedUsers = this.votedUsers.filter(vote => vote.userID !== userID);
      // Remove from user's votes
      await users.updateOne(
        { ID: userID },
        { $pull: { votes: { postID: this.postID } } }
      );
    } else if (existingVote.voteType === 'downvote') {
      this.upvotes += 1;
      this.downvotes -= 1;
      existingVote.voteType = 'upvote';
      // Remove previous downvote and add upvote for user
      await users.updateOne(
        { ID: userID },
        { 
          $pull: { votes: { postID: this.postID } },
          $push: { votes: { postID: this.postID, voteType: 'upvote' } }
        }
      );
    }
  } else {
    this.upvotes += 1;
    this.votedUsers.push({ userID, voteType: 'upvote' });
    // Add upvote to user's votes
    await users.updateOne(
      { ID: userID },
      { $push: { votes: { postID: this.postID, voteType: 'upvote' } } }
    );
  }

  await this.save();
};

postsschema.methods.downvote = async function(userID) {
  console.log("Downvoting by user:", userID);

  const existingVote = this.votedUsers.find(vote => vote.userID === userID);
  
  if (existingVote) {
    if (existingVote.voteType === 'downvote') {
      this.downvotes -= 1;
      this.votedUsers = this.votedUsers.filter(vote => vote.userID !== userID);
      // Remove from user's votes
      await users.updateOne(
        { ID: userID },
        { $pull: { votes: { postID: this.postID } } }
      );
    } else if (existingVote.voteType === 'upvote') {
      this.upvotes -= 1;
      this.downvotes += 1;
      existingVote.voteType = 'downvote';
      // Remove previous upvote and add downvote for user
      await users.updateOne(
        { ID: userID },
        { 
          $pull: { votes: { postID: this.postID } },
          $push: { votes: { postID: this.postID, voteType: 'downvote' } }
        }
      );
    }
  } else {
    this.downvotes += 1;
    this.votedUsers.push({ userID, voteType: 'downvote' });
    // Add downvote to user's votes
    await users.updateOne(
      { ID: userID },
      { $push: { votes: { postID: this.postID, voteType: 'downvote' } } }
    );
  }

  await this.save();
};

module.exports = mongoose.model("posts", postsschema);