
var userArray, forumArray;

document.addEventListener("DOMContentLoaded", async ()=>{
    const pathway = localStorage.getItem('path');

    if(Object.entries(pathway)[0][1] == '1')
        isLogin();
    else if(Object.entries(pathway)[0][1] == '2')
        isSignup();
    
})

async function isSignup(){
    console.log("Enter Signup");
    try{
        const userRes = await fetch('/getUsers');
        const userdata = await userRes.json();
        const forumRes = await fetch('/getForums')
        const forumdata = forumRes.json();
        var userArray = Object.entries(userdata);
        var forumArray = Object.entries(forumdata);
        var info = Object.values(userArray[userArray.length-1][1]);

        console.log(info);
        displayInfo(info);

    }catch(err){
        console.error(err);
    }

}

async function isLogin(){
    console.log("Enter Login");
    const ID = parseInt(localStorage.getItem('loginID'));
    try{
        const userRes = await fetch('/getUsers');
        const userdata = await userRes.json();
        const forumRes = await fetch('/getForums')
        const forumdata = forumRes.json();
        var userArray = Object.entries(userdata);
        var forumArray = Object.entries(forumdata);

        for(var i = 0; i < userArray.length; i++)
        {
            if(ID == Object.values(userArray[i][1])[1]){
                var info = Object.values(userArray[i][1]);
            }
        }

        console.log(info);
        displayInfo(info);

    }catch(err){
        console.error(err);
    }

}

function displayInfo(info){

    const displayUserName = document.querySelector('.profile-username h2');
    const displayEmail = document.querySelector('.profile-username h3');
    const displayProfile = document.querySelector('.profile-img');

    displayUserName.textContent = info[2];
    displayEmail.textContent = info[3];
    displayProfile.src = info[6];

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

