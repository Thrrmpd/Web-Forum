const express = require('express')
const mongoose = require('mongoose')
const parser = require('body-parser')
const users = require('./userModels')
const forums = require('./forumModels')
const posts = require('./postsModel')

var ID = 1000, username = "Test", email = "helloworld.to", password = "password", objectID;

const conn = express();

mongoose.connect('mongodb://localhost:27017/forumappdb')

/***********************************CREATE***************************************/
    function addUsers(){
        conn.post('/addingUser', async (req, res) => {
            try{
                const newUser = await new users({
                    ID: ID,
                    name: username,
                    email: email,
                    password: password,
                    isForumCreator: false
                });
                const addedUser = await newUser.save();
                
                console.log(addedUser);
                res.status(201).json(addedUser);
                

            }catch(exception){
                console.log("error...\n", exception)
            }
        })

    }

    function addForums(){
        conn.post('/addingForums', async (req, res) => {
            try{
                const newForum = await new forums({
                    forID: ID,
                    title: username,
                    description: email,
                    code: password,
                    creatID: null
                });
                const addedForum = await newForum.save();
                
                console.log(addedForum);
                res.status(201).json(addedForum);
                

            }catch(exception){
                console.log("error...\n", exception)
            }
        })

    }

    function addPosts(){
        conn.post('/addingPost', async (req, res) => {
            try{
                const newPost = await new posts({
                    postID: 10000,
                    filename: username,
                    description: email,
                    title: password,
                    type: "Public",
                    creatID: null
                });
                const addedPost = await newPost.save();
                
                console.log(addedPost);
                res.status(201).json(addedPost);
                

            }catch(exception){
                console.log("error...\n", exception)
            }
        })

    }
/********************************************************************************/

/***********************************READ*****************************************/
    function getUsers(){
        conn.get("/getUsers", async (req, res) => {
            let get = await users.find({})
            console.log(get);
            res.json(get);
        })
        }

    function getForums(){
        conn.get("/getForums", async (req, res) => {
            let get = await forums.find({})
            console.log(get);
            res.json(get);
        })
        }

    function getPosts(){
        conn.get("/getPosts", async (req, res) => {
            let get = await posts.find({})
            console.log(get);
            res.json(get);
        })
    }

/********************************************************************************/

/***********************************UPDATE***************************************/

function updateUser(){
conn.post('/updateUser/:userID', async (req, res) => {
    const userID = req.params.userID;
    try{
    const updateInfo = await users.findByIdAndUpdate(
        userID,
        {name: "Thomas Anderson"}
    );

    if(!updateInfo){
        return res.status(404).json({error: "User not found"});
    }

    console.log("Task Updated: ", updateInfo);
    res.status(200).json(updateInfo);
    }catch(exception){
        console.error(exception);
        res.status(500).json({error: "Failed to update user"});
    }

})
}

function updateForum(){
    conn.post('/updateForum/:forumID', async (req, res) => {
        const forumID = req.params.forumID;
        try{
        const updateInfo = await forums.findByIdAndUpdate(
            forumID,
            {title: "New Title"}
        );
    
        if(!updateInfo){
            return res.status(404).json({error: "Forum not found"});
        }
    
        console.log("Forum Updated: ", updateInfo);
        res.status(200).json(updateInfo);
        }catch(exception){
            console.error(exception);
            res.status(500).json({error: "Failed to update Forum"});
        }
    
    })
    }

    function updatePost(){
        conn.post('/updatePost/:postID', async (req, res) => {
            const postID = req.params.postID;
            try{
            const updateInfo = await posts.findByIdAndUpdate(
                postID,
                {filename: "new.txt"}
            );
        
            if(!updateInfo){
                return res.status(404).json({error: "Comment not found"});
            }
        
            console.log("Task Updated: ", updateInfo);
            res.status(200).json(updateInfo);
            }catch(exception){
                console.error(exception);
                res.status(500).json({error: "Failed to update Post"});
            }
        
        })
        }


/********************************************************************************/

/***********************************DELETE***************************************/
function deleteUser(){
    conn.delete('/deleteUser/:userID', async (req, res) =>{
        const userID = req.params.userID;
        try{
            const deleteUser = await users.findByIdAndDelete(userID);

            if(!deleteUser){
                return res.status(404).json({error: "User not found"});
            }

            console.log("User Removed", userID);
            res.status(200).json({message:"User Deleted Successfully"});
        }catch(exception){
            console.log(exception);
        }

    })
}

function deleteForum(){
    conn.delete('/deleteForum/:forumID', async (req, res) =>{
        const forumID = req.params.forumID;
        try{
            const deleteForum = await forums.findByIdAndDelete(forumID);

            if(!deleteForum){
                return res.status(404).json({error: "Forum not found"});
            }

            console.log("User Removed", forumID);
            res.status(200).json({message:"Forum Deleted Successfully"});
        }catch(exception){
            console.log(exception);
        }

    })

}

function deletePost(){
    conn.delete('/deletePost/:postID', async (req, res) =>{
        const postID = req.params.postID;
        try{
            const deletePost = await posts.findByIdAndDelete(postID);

            if(!deletePost){
                return res.status(404).json({error: "Post not found"});
            }

            console.log("User Removed", postID);
            res.status(200).json({message:"Post Deleted Successfully"});
        }catch(exception){
            console.log(exception);
        }

    })

}
/********************************************************************************/

conn.listen(8080, () => {
    getUsers();
    getForums();
    getPosts();

    addUsers();
    addForums();
    addPosts();

    updateUser();
    updateForum();
    updatePost();

    deleteUser();
    deleteForum();
    deletePost();
console.log("Server is Running...");
})
