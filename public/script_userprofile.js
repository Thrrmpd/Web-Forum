
var userArray, forumArray;

document.addEventListener("DOMContentLoaded", async ()=>{
    const pathway = localStorage.getItem('path');

    if(Object.entries(pathway)[0][1] == '1')
        isLogin();
    else if(Object.entries(pathway)[0][1] == '2')
        isSignup();
    
})

async function isSignup(){ //signup function
    try{ //Try catch block needed in case promise error occurs because of fetch()

        const userRes = await fetch('/getUsers'); //calls /getUsers api on forumnode.js and gets data from them; for user info
        const userdata = await userRes.json();//converts userRes to an object var to be passed to userData
        const forumRes = await fetch('/getForums') //calls /getForums api on forumnode.js and gets data from them; for forum info
        const forumdata = forumRes.json(); //converts forumRes to an object var to be passed to forumData
        var userArray = Object.entries(userdata); //get array of objects from userdata
        var forumArray = Object.entries(forumdata); //get array of objects from forumdata
        var info = Object.values(userArray[userArray.length-1][1]); //Will change this, but otherwise gets corresponding user info array

        console.log(info); //check if info is not null
        displayInfo(info); //display info

    }catch(err){
        console.error(err);
    }

}

async function isLogin(){ //login function
    const ID = parseInt(localStorage.getItem('loginID')); //used this to get user data of user that logged in
    
    try{//Try catch block needed in case promise error occurs because of fetch()

        const userRes = await fetch('/getUsers'); //calls /getUsers api on forumnode.js and gets data from them; for user info
        const userdata = await userRes.json();//converts userRes to an object var to be passed to userData
        const forumRes = await fetch('/getForums') //calls /getForums api on forumnode.js and gets data from them; for forum info
        const forumdata = forumRes.json(); //converts forumRes to an object var to be passed to forumData
        var userArray = Object.entries(userdata); //get array of objects from userdata
        var forumArray = Object.entries(forumdata); //get array of objects from forumdata

        for(var i = 0; i < userArray.length; i++) //for loop to get user with ID == const ID 
        {
            if(ID == Object.values(userArray[i][1])[1]){ //if ID == const ID, info = user info with ID = const iD
                var info = Object.values(userArray[i][1]);
            }
        }

        console.log(info); //checker if info is null or not
        displayInfo(info); //display info

    }catch(err){
        console.error(err);
    }

}

function displayInfo(info){ //For displaying corresponding username, email, and pfp

    const displayUserName = document.querySelector('.profile-username h2'); //get contents of h2 in profile-username div class in index_userprofile.html
    const displayEmail = document.querySelector('.profile-username h3'); //get contents of h3 in profile-username div class in index_userprofile.html
    const displayProfile = document.querySelector('.profile-img'); //get contents of img class profile-img in index_userprofile.html

    displayUserName.textContent = info[2]; //display username (ex. "Ava Lee") to index_userprofile.html
    displayEmail.textContent = info[3]; //display email (ex. "hannahcorpuz2003@gmail.com") to index_userprofile.html
    displayProfile.src = info[6]; //display corresponding pfp of user to index_userprofile.html

}


document.addEventListener("DOMContentLoaded", function () {
    const forumEntries = document.querySelectorAll(".forum-entry");

    forumEntries.forEach(entry => {
        entry.addEventListener("click", function () {
            const forumTitle = this.querySelector(".forum-title").textContent;
            showForumDetails(forumTitle);
        });
    });
});

function showForumDetails(forumTitle) {
    alert(`Forum Information for ${forumTitle}`);
}

document.addEventListener("DOMContentLoaded", function () {
    const createForumButton = document.querySelector(".createforum-button");

    if (createForumButton) {
        createForumButton.addEventListener("click", function () {
            window.location.href = "createforum.html"; // placeholder html
        });
    }
});

