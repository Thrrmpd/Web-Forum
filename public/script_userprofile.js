
var userarray;

document.addEventListener("DOMContentLoaded", async ()=>{
    try{
        const res = await fetch('/getUsers');
        const userdata = res.json();
        userarray = Object.entries(userdata);
        
    }catch(err){
        console.error(err);
    }
})


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

