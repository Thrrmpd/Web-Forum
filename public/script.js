async function joinForum() {
    const forumCode = document.getElementById('forumCode').value.trim(); // Get the entered forum code

    if (!forumCode) {
        alert('Please enter a forum code.');
        return;
    }

    try {
        const res = await fetch(`/getForumByCode/${forumCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            const forum = await res.json();
            console.log('Forum found:', forum);

            window.location.href = `forum_post.html?forumID=${forum._id}`;
        } else {
            const error = await res.json();
            alert(error.message || 'Forum not found.');
        }
    } catch (err) {
        alert('An error occurred while trying to join the forum.');
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log(localStorage.getItem('path'));
    const loginID = sessionStorage.getItem('loginObject');
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

            navRight.innerHTML = `Logged in: <a href="index_userprofile.html"> ${userName}</a> | <a href="#" onclick="logout()">Log Out</a>`; // change and display user name and logout link
            
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    } else {
        console.log('No loginID found in localStorage');
    }
});

function logout() {
    sessionStorage.removeItem('loginObject');
    localStorage.removeItem('path');
    window.location.href = 'index.html'; 
}