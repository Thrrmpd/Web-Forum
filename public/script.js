function joinForum() {
    const code = document.getElementById("forumCode").value;
    if (code === "FORUM1") {
        window.location.href = "forum_post.html"; 
    } else {
        alert("Please enter a forum code!");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const loginID = localStorage.getItem('loginObject');
    console.log('loginID from localStorage:', loginID); // NEED FOR DEBUGG

    const navRight = document.getElementById('nav-right');
    console.log('navRight element:', navRight); // another debug

    if (loginID) {
        try {
            const userRes = await fetch(`/getUser/${loginID}`); 
            console.log('Response from /getUser endpoint:', userRes); // debug

            const userData = await userRes.json();
            console.log('User Data:', userData); // console debug

            const userName = userData.name; // name
            console.log('User Name:', userName); // console debuf

            navRight.innerHTML = `Logged in: ${userName} | <a href="#" onclick="logout()">Log Out</a>`; // change and display user name and logout link
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    } else {
        console.log('No loginID found in localStorage');
    }
});

function logout() {
    localStorage.removeItem('loginID');
    window.location.href = 'index.html'; 
}