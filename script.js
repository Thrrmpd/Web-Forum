function joinForum() {
    const code = document.getElementById("forumCode").value;
    if (code === "FORUM1") {
        window.location.href = "forum1.html"; 
    } else {
        alert("Please enter a forum code!");
    }
}