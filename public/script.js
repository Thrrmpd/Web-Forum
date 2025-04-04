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
    
    console.log(sessionStorage.getItem('path'));
    var loginID = sessionStorage.getItem('loginObject');
    console.log('loginID from sessionStorage:', loginID); // NEED FOR DEBUGG

    const navRight = document.getElementById('nav-right');
    console.log('navRight element:', navRight); // another debug

    var loginStatus, buffer;

    if(document.cookie){
        const arr = document.cookie.split(';');
        
        for(let i = 0; i < arr.length; i++){
            if(arr[i].split('=')[0].trim() == 'loginStatus'){
                loginStatus = arr[i].split('=')[1];
                console.log(loginStatus);
            }
            if(arr[i].split('=')[0].trim() == 'userInfo'){
                const usArray = arr[i].split('=')[1].split(',');
                buffer = usArray[0];
                console.log(usArray);
            }
        }
    }

    if(loginStatus == 'true'){
        loginID = buffer;
    }

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
        console.log('No loginID found in sessionStorage');
    }
});

function logout() {
    sessionStorage.removeItem('loginObject');
    sessionStorage.removeItem('path');

    document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    console.log("All cookies and session storage cleared.");

    window.location.href = 'index.html';
}