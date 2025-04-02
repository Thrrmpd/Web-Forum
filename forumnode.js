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
const port = 3000;
const conn = express();

var username = "Test",
  email = "helloworld.to",
  password = "password",
  objectID;

// Middleware
conn.use(cors());
conn.use(express.json());
// conn.use(parser.urlencoded({ extended: true }));
// conn.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/forumappdb");

conn.use(express.static(path.join(__dirname, "public")));
conn.use(parser.json());
conn.use(cookieParser());

conn.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/***********************************CREATE***************************************/

//Add User API
conn.post("/addingUser", async (req, res) => {
  //This is actually a function
  try {
    const newUser = await new users({
      //Create new user object to be stored in db
      ID: req.body.ID, //get ID from html page (index_userprofile.html)
      name: req.body.name, //get username from html page (index_userprofile.html)
      email: req.body.email, // ^
      password: req.body.password, // ^
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
    const { title, description, type, filename, creatorID, forID } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and content are required!" });
    }

    // Auto-generate Post ID
    const lastPost = await posts.findOne().sort({ postID: -1 });
    const postID = lastPost ? lastPost.postID + 1 : 1;

    const newPost = new posts({
      postID,
      title,
      description,
      type,
      filename: filename || "",
      creatorID: creatorID || "0000", // Default creator ID if not provided
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
    // Ensures postID is passed
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  const { userID, text } = req.body;

  try {
    const updatedPost = await posts.findByIdAndUpdate(
      new mongoose.Types.ObjectId(postID),
      { $push: { comments: { userID, text } } }, // push comment to array
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

//Read API for posts; gets data from db
// conn.get("/getPosts", async (req, res) => {
//   //invoke via fetch() api and inputting url link ex. const x = await fetch('/getPosts')
//   let get = await posts.find({});
//   console.log(get);
//   res.json(get);
// });

//NEW UPDATE FOR READING POSTS.
conn.get("/getPosts", async (req, res) => {
  try {
    const Post = await posts.find().sort({ postID: -1 });
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
    const forum = await forums.findById(forumID);
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

/********************************************************************************/

/***********************************UPDATE***************************************/

conn.post("/updateUser/:userID", async (req, res) => {
  const userID = req.params.userID;
  console.log(userID);
  console.log(req.body.newUsername);
  console.log(req.body.newEmail);
  console.log(typeof req.body.newPFP);

  const updatePFP = {};

  try {
    if (req.body.newUsername) {
      console.log("newUsername happen");
      const updateInfo = await users.findByIdAndUpdate(userID, {
        $set: { name: req.body.newUsername },
      });

      if (!updateInfo) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("User Updated: ", updateInfo);
      success = updateInfo;
    }

    var success;

    if (req.body.newEmail) {
      console.log("newEmail happen");

      const updateInfo = await users.findByIdAndUpdate(userID, {
        $set: { email: req.body.newEmail },
      });

      if (!updateInfo) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log("User Updated: ", updateInfo);
      success = updateInfo;
    }

    if (req.body.newPFP) {
      console.log("newPFP happen");
      const updateInfo = await users.findByIdAndUpdate(userID, {
        $set: { picture: req.body.newPFP },
      });

      if (!updateInfo) {
        return res.status(404).json({ error: "User not found" });
      }

      success = updateInfo;
    }
    console.log("User Updated:", success);
    res.status(200).json(success);
  } catch (exception) {
    console.error(exception);
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

// conn.post("/updatePost/:postID", async (req, res) => {
//   const postID = req.params.postID;
//   try {
//     const updateInfo = await posts.findByIdAndUpdate(postID, {
//       filename: "new.txt",
//     });

//     if (!updateInfo) {
//       return res.status(404).json({ error: "Comment not found" });
//     }

//     console.log("Post Updated: ", updateInfo);
//     res.status(200).json(updateInfo);
//   } catch (exception) {
//     console.error(exception);
//     res.status(500).json({ error: "Failed to update Post" });
//   }
// });

conn.post("/updatePost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and content cannot be empty." });
    }

    const updatedPost = await posts.findByIdAndUpdate(
      postId,
      { title, description },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("Post Updated:", updatedPost);
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a comment
conn.put("/updateComment/:postID/:commentID", async (req, res) => {
  const { postID, commentID } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postID)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    const post = await posts.findOneAndUpdate(
      { _id: postID, "comments._id": commentID },
      { $set: { "comments.$.text": text } },
      { new: true }
    );

    if (!post)
      return res.status(404).json({ error: "Post or comment not found" });

    res.json(post);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update a comment" });
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

conn.delete("/deletePost/:postID", async (req, res) => {
  const postID = req.params.postID;
  try {
    const deletePost = await posts.findByIdAndDelete(postID);

    if (!deletePost) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("User Removed", postID);
    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (exception) {
    console.log(exception);
  }
});

// Delete a comment
conn.delete("/deleteComment/:postID/:commentID", async (req, res) => {
  const { postID, commentID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postID)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    const post = await posts.findOneAndUpdate(
      { _id: postID },
      { $pull: { comments: { _id: commentID } } }, // Removed from array
      { new: true }
    );

    if (!post)
      return res.status(404).json({ error: "Post or comment not found" });

    res.json(post);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete a comment" });
  }
});

/********************************************************************************/

/*******************************UPVOTE/DOWNVOTE**********************************/

conn.put('/upvote/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await posts.findById(postId);  
    if (!post) {
      return res.status(404).send('Post not found');
    }

    await post.upvote();  // Increment the upvote count

    res.status(200).json({ upvotes: post.upvotes });  
  } catch (error) {
    console.error("Error upvoting:", error);
    res.status(500).send('Server error');
  }
});

conn.put('/downvote/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await posts.findById(postId);  
    if (!post) {
      return res.status(404).send('Post not found');
    }

    await post.downvote();  // Decrement the downvote count

    res.status(200).json({ downvotes: post.downvotes });  
  } catch (error) {
    console.error("Error downvoting:", error);
    res.status(500).send('Server error');
  }
});

/********************************************************************************/

conn.listen(port, () => {
  console.log("Server is Running...");
});