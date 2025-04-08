const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");
const users = require("./userModels");
const logins = require("./loginModel.js");
const forums = require("./forumModels");
const posts = require("./postsModel");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const crypto = require('bcrypt');
const port = 3000;
const conn = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = mongoose.Types;

var username = "Test",
  email = "helloworld.to",
  password = "password",
  objectID;

// Middleware
conn.use(cors());
conn.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
conn.use(express.json());
conn.use("/uploads", express.static(path.join(__dirname, "uploads")));
// conn.use(parser.urlencoded({ extended: true }));
// conn.use(express.static(path.join(__dirname, "public")));


mongoose.connect("mongodb+srv://johannjoseph26:TbogoJXZubB7HEeg@cluster0.ujhsndz.mongodb.net/forumappdb?retryWrites=true&w=majority&appName=Cluster0");
//mongoose.connect("mongodb://127.0.0.1:27017/forumappdb")

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

conn.use(express.static(path.join(__dirname, "public")));
conn.use(parser.json());
conn.use(cookieParser());

conn.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

cloudinary.config ( {
  cloud_name: "danqjbdkc",
  api_key: "394157762231989",
  api_secret: "-j-2V252YCWfEdf1itQRrGFtZqM",
});

// check if cloudinary is connected
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("Cloudinary connection error:", error);
  } else {
    console.log("Cloudinary connected successfully:", result);
  }
})
/***********************************CREATE***************************************/

//Add User API
conn.post("/addingUser", async (req, res) => {
  //This is actually a function
  try {


    const hashedPassword = await crypto.hash(req.body.password, 10);

    const newUser = await new users({
      //Create new user object to be stored in db
      ID: req.body.ID, //get ID from html page (index_userprofile.html)
      name: req.body.name, //get username from html page (index_userprofile.html)
      email: req.body.email, // ^
      password: hashedPassword, // ^
      isForumCreator: false, // default forum creator is false since new user
      picture: "pfp.png", //standard pfp of new user is pfp.png
      loginID: 0,
    });
    const addedUser = await newUser.save();

    console.log(addedUser);
    res.status(201).json(addedUser); //adds newly made user data to db
  } catch (exception) {
    console.log("error...\n", exception);
  }
});

//Add user as logged in
conn.post("/addLogin", async (req, res) => {
  //This is actually a function

  try {
    const newLogin = await new logins({
      loginID: 100,
      userID: 1001,
    });

    const addedLogin = await newLogin.save();

    console.log(addedLogin);
    res.status(201).json(addedLogin); //adds newly made user data to db
  } catch (exception) {
    console.log("error...\n", exception);
  }
});

conn.post('/login', async (req, res)=>{

  try{
  const userdata = await users.find({});
  const check =  Object.entries(userdata);

  const userentries = Object.entries(userdata);

  
  for(var i = 0; i < userentries.length; i++){
    if(req.body.email == Object.values(userentries[i][1])[3]){
      var compare = await crypto.compare(req.body.password, Object.values(userentries[i][1])[3])
      if(compare == true){
        return res.status(200).json({message:"OK"})
      }
      else{
        return res.status(401).json({messsage:"NO"});
      }
    
    }
  }

  res.status(404).json({message: "Invalid Username or Password"});


}catch(err){
  console.log(err)
}

});

//Add Forum API, same function as add user api but differing number of attributes
conn.post("/addingForums", async (req, res) => {
  try {
    const { title, description, code, creatID } = req.body;

    // Check if the forum code is unique
    const existingForum = await forums.findOne({ code });
    if (existingForum) {
      return res.status(400).json({ message: "Forum code must be unique." });
    }

    // Generate the next forum ID
    const lastForum = await forums.findOne().sort({ forID: -1 }); // Get the forum with the highest forID
    const nextForID = lastForum ? lastForum.forID + 1 : 10000; // Start at 10000 if no forums exist

    // Create a new forum
    const newForum = new forums({
      forID: nextForID,
      title,
      description,
      code,
      creatID,
    });

    const addedForum = await newForum.save();
    console.log("Forum created:", addedForum);
    res.status(201).json(addedForum);
  } catch (err) {
    console.error("Error creating forum:", err);
    res.status(500).json({ message: "Failed to create forum." });
  }
});

//Add Post API, same function as add user api but differing number of attributes
conn.post("/addingPost", async (req, res) => {
  try {
    const { title, description, type, creatorID, forID } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and content are required!" });
    }

    // Auto-generate Post ID
    const lastPost = await posts.findOne().sort({ postID: -1 });
    const postID = lastPost ? lastPost.postID + 1 : 1;

    let imagePath = null;

    // Check if an image file is included in the request
    if (req.files && req.files.image) {
      const imageFile = req.files.image;

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "uploads", // Optional: specify a folder in Cloudinary
      });

      console.log("Cloudinary upload result:", result);

      imagePath = result.secure_url; // Cloudinary URL 
    } else { 
      console.log("No image file uploaded.");
    }

    const newPost = new posts({
      postID,
      title,
      description,
      type,
      filename: imagePath || "",
      creatorID: creatorID || "0000",
      forID: forID,
    });

    const savedPost = await newPost.save();
    console.log("Post Created:", savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add comment to a post
conn.post("/addingComment/:postID", async (req, res) => {
  const { postID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postID)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  const { userID, text } = req.body;

  if (!userID) {
    return res
      .status(400)
      .json({ error: "You need to be logged in to add a comment" });
  }

  try {
    const updatedPost = await posts.findByIdAndUpdate(
      new mongoose.Types.ObjectId(postID),
      { $push: { comments: { userID, text } } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add a comment" });
  }
});

/********************************************************************************/

/***********************************READ*****************************************/
//Read API for users; gets data from db
conn.get("/getUsers", async (req, res) => {
  //invoke via fetch() api and inputting url link ex. const x = await fetch('/getUsers')
  let get = await users.find({});
  console.log(get);
  res.json(get);
});

conn.get("/getLoggedIn", async (req, res) => {
  //invoke via fetch() api and inputting url link ex. const x = await fetch('/getUsers')
  let get = await logins.find({});
  console.log(get);
  res.json(get);
});

//Read API for forums; gets data from db
conn.get("/getForums", async (req, res) => {
  //invoke via fetch() api and inputting url link ex. const x = await fetch('/getForums')
  let get = await forums.find({});
  console.log(get);
  res.json(get);
});

//prev version
// conn.get("/getPosts", async (req, res) => {
//   try {
//     const Post = await posts.find().sort({ postID: -1 });
//     res.json(Post);
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//NEW UPDATE FOR READING POSTS. WORKING!
conn.get("/getPosts", async (req, res) => {
  try {
    const { forID } = req.query;
    if (!forID) {
      return res.status(400).json({ error: "Missing forID parameter" });
    }

    const Post = await posts.find({ forID }).sort({ postID: -1 });
    res.json(Post);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to get user data from the database
async function getUserFromDatabase(userID) {
  try {
    const user = await users.findById(userID);
    return user;
  } catch (err) {
    throw new Error("Database query failed");
  }
}

// READ API for users by ID
conn.get("/getUser/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await getUserFromDatabase(userID);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

conn.get("/getForum/:id", async (req, res) => {
  const forumID = req.params.id;
  try {

    let forum;

    // forumID is a ObjectId 
    if (ObjectId.isValid(forumID)) {
      forum = await forums.findById(forumID);
    } else {
      // forumID is not a ObjectId
      forum = await forums.findOne({ forID: parseInt(forumID) });
    }

    if (forum) {
      res.json(forum);
    } else {
      res.status(404).json({ message: "Forum not found." });
    }
  } catch (err) {
    console.error("Error fetching forum:", err);
    res.status(500).json({ message: "Failed to fetch forum." });
  }
});

// Read comments
conn.get("/getComments/:postID", async (req, res) => {
  const { postID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postID)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    const post = await posts.findById(postID).select("comments");
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comment" });
  }
});

conn.get("/getForumByCode/:forumCode", async (req, res) => {
  const forumCode = req.params.forumCode;

  try {
    const forum = await forums.findOne({ code: forumCode }); // Search for the forum by its code

    if (!forum) {
      return res.status(404).json({ message: "Forum not found." });
    }

    res.status(200).json(forum); // Return the forum details
  } catch (err) {
    console.error("Error finding forum:", err);
    res.status(500).json({ message: "Failed to find forum." });
  }
});

conn.get("/searchForums", async (req, res) => {
  const searchQuery = req.query.q;
  console.log("Search Query Received:", searchQuery);

  try {
    const matchingForums = await forums
      .find({
        title: { $regex: searchQuery, $options: "i" },
      })
      .select("title creatID");

    console.log("Matching Forums:", matchingForums);
    res.status(200).json(matchingForums);
  } catch (err) {
    console.error("Error searching forums:", err);
    res.status(500).json({ message: "Failed to search forums." });
  }
});

// Route to get all forums
conn.get("/api/all-forums", async (req, res) => {
  try {
      // Fetch all forums from the database
      const allForums = await forums.find();

      // Log the fetched forums to debug
      console.log("All Forums:", allForums);

      res.status(200).json(allForums);
  } catch (error) {
      console.error("Error fetching all forums:", error);
      res.status(500).json({ error: "Failed to fetch forums" });
  }
});

conn.get("/api/forum/:forID", async (req, res) => {
  try {
      const forumID = req.params.forID;

      // Fetch the forum with the matching forID
      const forum = await forums.findOne({ forID: parseInt(forumID) });

      if (!forum) {
          return res.status(404).json({ error: "Forum not found" });
      }

      res.status(200).json(forum);
  } catch (error) {
      console.error("Error fetching forum:", error);
      res.status(500).json({ error: "Failed to fetch forum" });
  }
});

/********************************************************************************/

/***********************************UPDATE***************************************/

conn.post("/updateUser/:userID", async (req, res) => {
  const userID = req.params.userID;
  const { newUsername, newEmail, newPFP } = req.body;

  try {
    // Build the update object dynamically
    const updateFields = {};
    if (newUsername) updateFields.name = newUsername;
    if (newEmail) updateFields.email = newEmail;
    if (newPFP) updateFields.picture = newPFP;

    // Check if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    console.log("Fields to update:", updateFields);

    // Perform the update
    const updatedUser = await users.findByIdAndUpdate(
      userID,
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User Updated:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (exception) {
    console.error("Error updating user:", exception);
    res.status(500).json({ error: "Failed to update user" });
  }
});

conn.post("/updateForum/:forumID", async (req, res) => {
  const forumID = req.params.forumID;
  const { title, description } = req.body; // Extract title and description from the request body

  try {
    const updateInfo = await forums.findByIdAndUpdate(
      forumID,
      { title, description }, // Use the values from the request body
      { new: true } // Return the updated document
    );

    if (!updateInfo) {
      return res.status(404).json({ error: "Forum not found" });
    }

    console.log("Forum Updated: ", updateInfo);
    res.status(200).json(updateInfo);
  } catch (exception) {
    console.error(exception);
    res.status(500).json({ error: "Failed to update Forum" });
  }
});

conn.put("/updateForum/:id", async (req, res) => {
  const forumID = req.params.id;
  const { title, description } = req.body;

  try {
    const updatedForum = await forums.findByIdAndUpdate(
      forumID,
      { title, description },
      { new: true } // Return the updated document
    );

    if (updatedForum) {
      res.status(200).json(updatedForum);
    } else {
      res.status(404).json({ message: "Forum not found." });
    }
  } catch (err) {
    console.error("Error updating forum:", err);
    res.status(500).json({ message: "Failed to update forum." });
  }
});

conn.post("/updatePost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { updatedPost, loggedInUserId } = req.body;
    const { title, description } = updatedPost;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and content cannot be empty." });
    }

    // Find the post by ID to get the creatorID
    const post = await posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the logged-in user is the creator of the post
    if (post.creatorID !== loggedInUserId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own posts" });
    }

    // If user is the creator, update the post
    const updatedPostData = await posts.findByIdAndUpdate(
      postId,
      { title, description },
      { new: true }
    );

    console.log("Post Updated:", updatedPostData);
    res.json(updatedPostData);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a comment
conn.put("/updateComment/:postID/:commentID", async (req, res) => {
  const { postID, commentID } = req.params;
  const { text, userID } = req.body;

  if (!userID) {
    return res
      .status(401)
      .json({ error: "You must be logged in to edit a comment." });
  }

  if (!mongoose.Types.ObjectId.isValid(postID)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    const post = await posts.findOne({
      _id: postID,
      "comments._id": commentID,
    });

    if (!post) {
      return res.status(404).json({ error: "Post or comment not found" });
    }

    const comment = post.comments.id(commentID);
    if (comment.userID !== userID) {
      return res
        .status(403)
        .json({ error: "You can only edit your own comments" });
    }

    comment.text = text;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

/********************************************************************************/

/***********************************DELETE***************************************/

conn.delete("/deleteUser/:userID", async (req, res) => {
  const userID = req.params.userID;
  try {
    const deleteUser = await users.findByIdAndDelete(userID);

    if (!deleteUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User Removed", userID);
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (exception) {
    console.log(exception);
  }
});

conn.delete("/deleteLogin/:loginID", async (req, res) => {
  const loginID = req.params.loginID;
  try {
    const deleteLogin = await logins.findByIdAndDelete(loginID);

    if (!deleteLogin) {
      return res.status(404).json({ error: "User not logged in" });
    }

    console.log("Login Removed", userID);
    res.status(200).json({ message: "Login Deleted Successfully" });
  } catch (exception) {
    console.log(exception);
  }
});

conn.delete("/deleteForum/:forumID", async (req, res) => {
  const forumID = req.params.forumID;
  try {
    const deleteForum = await forums.findByIdAndDelete(forumID);

    if (!deleteForum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    console.log("Forum Deleted:", deletedForum);
    res.status(200).json({ message: "Forum Deleted Successfully" });
  } catch (exception) {
    console.log(exception);
  }
});

// conn.delete("/deletePost/:postID", async (req, res) => {
//   const postID = req.params.postID;
//   try {
//     const deletePost = await posts.findByIdAndDelete(postID);

//     if (!deletePost) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     console.log("User Removed", postID);
//     res.status(200).json({ message: "Post Deleted Successfully" });
//   } catch (exception) {
//     console.log(exception);
//   }
// });

conn.delete("/deletePost/:postID", async (req, res) => {
  const postID = req.params.postID;
  const { loggedInUserId } = req.body; // Get logged-in user ID from request body

  try {
    const post = await posts.findById(postID);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the logged-in user is the creator of the post
    if (post.creatorID !== loggedInUserId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own posts" });
    }

    // If the user is the creator, delete the post
    await posts.findByIdAndDelete(postID);

    console.log("Post Deleted", postID);
    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (exception) {
    console.log(exception);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a comment
conn.delete("/deleteComment/:postID/:commentID", async (req, res) => {
  const { postID, commentID } = req.params;
  const { userID } = req.body;

  if (!userID) {
    return res
      .status(401)
      .json({ error: "You must be logged in to delete a comment." });
  }

  if (!mongoose.Types.ObjectId.isValid(postID)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    const post = await posts.findOneAndUpdate(
      { _id: postID, "comments._id": commentID, "comments.userID": userID },
      { $pull: { comments: { _id: commentID } } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        error:
          "Post or comment not found, or you're not authorized to delete this comment",
      });
    }

    res.json(post);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete a comment" });
  }
});

/********************************************************************************/

/*******************************UPVOTE/DOWNVOTE**********************************/

// Handle upvote action
conn.put("/upvote/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userID } = req.body;

  try {
    console.log("UserID from request:", userID);

    const post = await posts.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const user = await users.findOne({ ID: userID });
    if (!user) return res.status(404).send("User not found");

    const existingVote = post.votedUsers.find((vote) => vote.userID === userID);

    if (existingVote) {
      if (existingVote.voteType === "upvote") {
        // Remove upvote
        post.upvotes -= 1;
        post.votedUsers = post.votedUsers.filter(
          (vote) => vote.userID !== userID
        );
        // Remove post from votes
        user.votes = user.votes.filter(
          (vote) => vote.postID.toString() !== postId
        );
      } else if (existingVote.voteType === "downvote") {
        // Change vote from downvote to upvote
        post.upvotes += 1;
        post.downvotes -= 1;
        existingVote.voteType = "upvote";
        // Update votes array
        user.votes = user.votes.map((vote) =>
          vote.postID.toString() === postId
            ? {
                postID: new mongoose.Types.ObjectId(postId),
                voteType: "upvote",
              }
            : vote
        );
      }
    } else {
      // New upvote
      post.upvotes += 1;
      post.votedUsers.push({ userID, voteType: "upvote" });
      // Add post to votes array
      user.votes.push({
        postID: new mongoose.Types.ObjectId(postId),
        voteType: "upvote",
      });
    }

    await post.save();
    await user.save();

    res.status(200).json({ upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (error) {
    console.error("Error upvoting:", error);
    res.status(500).send("Server error");
  }
});

// Handle downvote action
conn.put("/downvote/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userID } = req.body;

  try {
    console.log("UserID from request:", userID);

    const post = await posts.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const user = await users.findOne({ ID: userID });
    if (!user) return res.status(404).send("User not found");

    const existingVote = post.votedUsers.find((vote) => vote.userID === userID);

    if (existingVote) {
      if (existingVote.voteType === "downvote") {
        // Remove downvote
        post.downvotes -= 1;
        post.votedUsers = post.votedUsers.filter(
          (vote) => vote.userID !== userID
        );
        // Remove post from votes
        user.votes = user.votes.filter(
          (vote) => vote.postID.toString() !== postId
        );
      } else if (existingVote.voteType === "upvote") {
        // Change vote from upvote to downvote
        post.upvotes -= 1;
        post.downvotes += 1;
        existingVote.voteType = "downvote";
        // Update votes array
        user.votes = user.votes.map((vote) =>
          vote.postID.toString() === postId
            ? {
                postID: new mongoose.Types.ObjectId(postId),
                voteType: "downvote",
              }
            : vote
        );
      }
    } else {
      // New downvote
      post.downvotes += 1;
      post.votedUsers.push({ userID, voteType: "downvote" });
      // Add post to votes array
      user.votes.push({
        postID: new mongoose.Types.ObjectId(postId),
        voteType: "downvote",
      });
    }

    await post.save();
    await user.save();

    res.status(200).json({ upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (error) {
    console.error("Error downvoting:", error);
    res.status(500).send("Server error");
  }
});

/********************************************************************************/
/***********************************POPULAR**************************************/

conn.get("/api/popular", async (req, res) => {
  try {
    const forums = await posts.aggregate([
      {
        $group: {
          _id: "$forID", 
          totalUpvotes: { $sum: "$upvotes" },
          totalDownvotes: { $sum: "$downvotes" },
        }
      },
      { $sort: { totalUpvotes: -1 } }, 
      { $limit: 5 }, 
      {
        $lookup: {
          from: "forums", 
          localField: "_id",
          foreignField: "forID", 
          as: "forumDetails"
        }
      },
      {
        $unwind: "$forumDetails" 
      },
      {
        $project: {
          forID: "$forumDetails.forID", 
          title: "$forumDetails.title", 
          totalUpvotes: 1,
          totalDownvotes: 1
        }
      }
    ]);    

    console.log("Aggregated forums:", forums);

    res.json(forums);
  } catch (error) {
    console.error("Error fetching top 5 forums:", error);
    res.status(500).send("Server error");
  }
});

/********************************************************************************/

conn.listen(port, () => {
  console.log("Server is Running...");
});
