const express = require('express')
const mongoose = require('mongoose')
const parser = require('body-parser')
const users = require('./userModels')
const forums = require('./forumModels')
const posts = require('./postsModel')
const path = require('path')
const port = 3000


var username = "Test", email = "helloworld.to", password = "password", objectID;

const conn = express();

mongoose.connect('mongodb://localhost:27017/forumappdb')

    conn.use(express.static(path.join(__dirname,'public')))
    conn.use(parser.json());

    conn.get('/', (req,res)=>{
        res.sendFile(path.join(__dirname, 'index.html'))
    })

/***********************************CREATE***************************************/
    

 //Add User API
        conn.post('/addingUser', async (req, res) => { //This is actually a function
            try{
                const newUser = await new users({ //Create new user object to be stored in db
                    ID: req.body.ID, //get ID from html page (index_userprofile.html)
                    name: req.body.name, //get username from html page (index_userprofile.html)
                    email: req.body.email, // ^
                    password: req.body.password, // ^
                    isForumCreator: false, // default forum creator is false since new user
                    picture: "pfp.png" //standard pfp of new user is pfp.png
                });
                const addedUser = await newUser.save();
                
                console.log(addedUser);
                res.status(201).json(addedUser); //adds newly made user data to db
                

            }catch(exception){
                console.log("error...\n", exception)
            }
        })

    

     //Add Forum API, same function as add user api but differing number of attributes
        conn.post('/addingForums', async (req, res) => { //invoke via fetch() api and inputting url link ex. const x = await fetch('/addingForums')
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

    

    //Add Post API, same function as add user api but differing number of attributes
        conn.post('/addingPost', async (req, res) => { //invoke via fetch() api and inputting url link ex. const x = await fetch('/addingPost')
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

    
/********************************************************************************/

/***********************************READ*****************************************/
     //Read API for users; gets data from db 
        conn.get("/getUsers", async (req, res) => { //invoke via fetch() api and inputting url link ex. const x = await fetch('/getUsers')
            let get = await users.find({})
            console.log(get);
            res.json(get);
        })
        

     //Read API for forums; gets data from db 
        conn.get("/getForums", async (req, res) => { //invoke via fetch() api and inputting url link ex. const x = await fetch('/getForums')
            let get = await forums.find({})
            console.log(get);
            res.json(get);
        })
        

     //Read API for posts; gets data from db 
        conn.get("/getPosts", async (req, res) => { //invoke via fetch() api and inputting url link ex. const x = await fetch('/getPosts')
            let get = await posts.find({})
            console.log(get);
            res.json(get);
        })

    // Function to get user data from the database
    async function getUserFromDatabase(userID) {
        try {
            const user = await users.findById(userID);
            return user;
        } catch (err) {
            throw new Error('Database query failed');
        }
    }

    // READ API for users by ID
        conn.get('/getUser/:id', async (req, res) => {
            const userID = req.params.id;
            try {
                const user = await getUserFromDatabase(userID); 
                if (user) {
                    res.json(user);
                } else {
                    res.status(404).send('User not found');
                }
            } catch (err) {
                res.status(500).send('Server error');
            }
        });
    

/********************************************************************************/

/***********************************UPDATE***************************************/


conn.post('/updateUser/:userID', async (req, res) => {
    const userID = req.params.userID;
    try{
    const updateInfo = await users.findByIdAndUpdate(
        userID,
        //{name: "Thomas Anderson"}
    );

    if(!updateInfo){
        return res.status(404).json({error: "User not found"});
    }

    console.log("User Updated: ", updateInfo);
    res.status(200).json(updateInfo);
    }catch(exception){
        console.error(exception);
        res.status(500).json({error: "Failed to update user"});
    }

})



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
        
            console.log("Post Updated: ", updateInfo);
            res.status(200).json(updateInfo);
            }catch(exception){
                console.error(exception);
                res.status(500).json({error: "Failed to update Post"});
            }
        
        })
        


/********************************************************************************/

/***********************************DELETE***************************************/

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


/********************************************************************************/

conn.listen(port, () => {
    
console.log("Server is Running...");
})
