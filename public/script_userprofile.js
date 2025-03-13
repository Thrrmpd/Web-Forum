
var userArray, forumArray;

document.addEventListener("DOMContentLoaded", async ()=>{
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
})

function displayInfo(info){

    const displayUserName = document.querySelector('.profile-username h2');
    const displayProfile = document.querySelector('.profile-container');

    displayUserName.textContent = info[2];

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

