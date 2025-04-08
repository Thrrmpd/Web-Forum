
var userArray, forumArray, userObject, loggedinUsers, loggedinForums, pathway, loginStatus;

document.addEventListener("DOMContentLoaded", async () => {
    const loginID = sessionStorage.getItem('loginID');
    console.log(sessionStorage.getItem('loginID'));
    var forums = [];

    try {
        // Fetch forums created by the logged-in user
        const res = await fetch(`/getForumsByUser/${loginID}`);
        if (!res.ok) {
            throw new Error("Failed to fetch forums.");
        }

        const forumsofUser = await res.json();
        console.log("Fetched Forums:", forumsofUser);

        // Display the forums
        displayForums(forumsofUser, "Your Forum");
    } catch (err) {
        console.error("Error fetching forums:", err);
    }

    if (document.cookie) {
        const userCookie = document.cookie.split(';');
        console.log(userCookie);

        userCookie.forEach(cookie => {
            const [key, value] = cookie.split('=').map(item => item.trim());

            if (key === 'userInfo') {
                userArray = value || '';  
                console.log(value);
            } else if (key === 'forumInfo') {
                forumArray = value || '';
                console.log(value);
            } else if (key === 'loginStatus') {
                loginStatus = value || '';
                console.log(value);
            }
        });

        console.log(userArray);
        console.log(forumArray);
        console.log(loginStatus);

        if (forumArray) {
            try {
                const split = decodeURIComponent(forumArray);
                const bukaka = split.split(']');

                let bukakaMore;
                let i = 0;
                console.log(bukaka);
                while (bukaka[i] !== '') {
                    bukakaMore = bukaka[i].replaceAll('[', '').replaceAll('"', '');
                    forums.push(bukakaMore.split(',').filter(Boolean));
                    i++;
                }

                sessionStorage.setItem('loginForums', JSON.stringify(forums));
            } catch (e) {
                console.error('Error decoding forum array:', e);
            }
        }

    } else {
        try {
            const userRes = await fetch('/getUsers');
            const forumRes = await fetch('/getForums');
            const loginRes = await fetch('/getLoggedIn');
            isLogin(userRes, forumRes, loginRes);
        } catch (err) {
            console.error(err);
        }
    }

    if (loginStatus === 'true' && sessionStorage.getItem('loginID') === userArray.split(',').filter(Boolean)[1]) {
        displayInfo(userArray.split(',').filter(Boolean)); 
        
        const storedForums = sessionStorage.getItem('loginForums');
        if (storedForums) {
            forums = JSON.parse(storedForums);
            // displayForums(forums, userArray.split(',').filter(Boolean)[2]); 
        }

        sessionStorage.setItem('loginObject', userArray.split(',').filter(Boolean)[0]);
        sessionStorage.setItem('loginInfo', JSON.stringify(userArray.split(',').filter(Boolean)));

        userObject = userArray.split(',').filter(Boolean)[0];
        console.log(userObject);
        console.log(userArray.split(',').filter(Boolean));
        console.log(userArray.split(',').filter(Boolean)[0]);
    }
    else if (loginStatus === 'false' && sessionStorage.getItem('loginID') === userArray.split(',').filter(Boolean)[1]) {
        document.cookie = 'loginStatus=true';
        window.location.reload();
    } else {
        try {
            const userRes = await fetch('/getUsers');
            const forumRes = await fetch('/getForums');
            const loginRes = await fetch('/getLoggedIn');
            isLogin(userRes, forumRes, loginRes);
        } catch (err) {
            console.error(err);
        }
    }
});

async function isLogin(userRes, forumRes, loginRes){ //login function
    
        const ID = parseInt(sessionStorage.getItem('loginID')); //used this to get user data of user that logged in
        console.log(ID);
        
    console.log(Object.entries(await loginRes.json()).length);
    try{//Try catch block needed in case promise error occurs because of fetch()
        
        
        const userdata = await userRes.json();//converts userRes to an object var to be passed to userData
        
        const forumdata = await forumRes.json(); //converts forumRes to an object var to be passed to forumData
        var userArray = Object.entries(userdata); //get array of objects from userdata
        var forumArray = Object.entries(forumdata); //get array of objects from forumdata
        var info;
        var forums = [];

        for(var i = 0; i < userArray.length; i++) //for loop to get user with ID == const ID 
        {
            if(ID == Object.values(userArray[i][1])[1]){ //if ID == const ID, info = user info with ID = const iD
                
                info = Object.values(userArray[i][1]);

                if(!document.cookie){
                document.cookie = `userInfo=${info}; max-age=86400; path=/`;
                document.cookie = `loginStatus=true; max-age=86400; path=/`;
                }
                sessionStorage.setItem('loginObject', info[0]);
                break;
            }
        }

        for(var i = 0; i < forumArray.length; i++)
        {
            if(ID == Object.values(forumArray[i][1])[5]){
                forums.push(Object.values(forumArray[i][1]))
            }

        }

        console.log(forums)
        
        
        
        
        userObject = info[0];
        console.log(userObject);

        sessionStorage.setItem('loginInfo', JSON.stringify(info));
        sessionStorage.setItem('loginForums', JSON.stringify(forums))

        displayInfo(info); 

        if(forums.length != 0){
            // displayForums(forums, info[2]);
            if(!document.cookie)
                document.cookie = `forumInfo=${encodeURIComponent(JSON.stringify(forums))}; max-age=86400; path=/`;
        }

    }catch(err){
        console.error(err);
    }

}

function displayForums(forums, creatorName){
    const forumEntries = document.getElementById("forum-list"); //get contents of forum-entry class in index_userprofile.html
    forumEntries.innerHTML = '';

    console.log(forums);

    

    for(let i = 0; i < forums.length; i++)
    {

        const newDiv = document.createElement('div');
        const newSpan = document.createElement('span');
        const newButton = document.createElement('button');
        const forumDescription = document.createElement('div');
        const updateButton = document.createElement('button');
        const deleteButton = document.createElement('button');


        newDiv.className = 'forum-entry';
        newSpan.className = 'forum-title';
        updateButton.className = 'update-forum';
        deleteButton.className = 'delete-forum';
        newButton.className = 'info-button';

        newSpan.textContent = forums[i][2];

        updateButton.textContent = 'Update';
        deleteButton.textContent = 'Delete';
        newButton.textContent = '...';

        forumDescription.className = `forum-entry`;
        forumDescription.setAttribute('name', `forum${i}`);
        forumDescription.appendChild(document.createTextNode(`Creator: ${creatorName}`));
        forumDescription.appendChild(document.createElement('br'));
        forumDescription.appendChild(document.createElement('br'));
        forumDescription.appendChild(document.createTextNode(`Description: ${forums[i][3]}`));
        forumDescription.appendChild(document.createElement('br'));
        forumDescription.appendChild(document.createElement('br'));
        forumDescription.appendChild(document.createTextNode(`Forum Code: ${forums[i][4]}`));
        forumDescription.style.display = 'none';

        index = i;

        // Add event listener for updating the forum
        updateButton.addEventListener('click', ((index) => {
            return () => {
                const newTitle = prompt('Enter new title:', forums[index][2]);
                const newDescription = prompt('Enter new description:', forums[index][3]);

                if (newTitle && newDescription) {
                    updateForum(forums[index][0], newTitle, newDescription); // Pass forum ID and new details
                }
            };
        })(i)); // Pass the current index to the closure

        deleteButton.addEventListener('click', ((index) => {
            return async () => {
                if (confirm('Are you sure you want to delete this forum?')) {
                    try {
                        deleteForum(forums[index][0]); // Pass forum ID
                        alert('Forum deleted successfully!');
                        window.location.reload();
                    } catch (err) {
                        console.error('Error deleting forum:', err);
                        alert('Failed to delete forum.');
                    }
                }
            };
        })(i)); 

        newButton.addEventListener('click', (function(i){
            var display = 0;
            
            return function(){
                var show = document.querySelector(`div[name=forum${i}]`);

                if(display == 0){
                    show.style.display = 'flex';                   
                    display = 1;
                }
                else{
                    show.style.display = 'none';
                    display = 0;
                }
                
            };

        })(i));

        newDiv.appendChild(newSpan);
        newDiv.appendChild(updateButton);
        newDiv.appendChild(deleteButton);
        newDiv.appendChild(newButton);
        forumEntries.appendChild(newDiv);
        forumEntries.appendChild(forumDescription);

    }

}

async function updateForum(forumID, newTitle, newDescription){
    try{
        const res = await fetch(`/updateForum/${forumID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        if(res.ok){
            alert('Forum updated!');

            if(loginStatus == 'true'){
                const forumRes = await fetch('/getForums');
                const arr = Object.entries(await forumRes.json());
                var forums = [];
                

                for(var i = 0; i < arr.length; i++){
                    console.log(arr[i][1]['creatID']);
                    if(arr[i][1]['creatID'] == parseInt(sessionStorage.getItem('loginID')))
                        forums.push(Object.values(arr[i][1]));
                    }

                    document.cookie = `forumInfo=${encodeURIComponent(JSON.stringify(forums))}`;

            }

            window.location.reload();
        }else{
            alert('Failed to update forum');
        }
    }
    catch(err){
        console.error('Error updating forum:', err);

    }
}

async function deleteForum(forumID) {
    try {
        const res = await fetch(`/deleteForum/${forumID}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to delete forum');
        }

        console.log('Forum deleted successfully, reloading page...');
        if(loginStatus == 'true'){
            const forumRes = await fetch('/getForums');
            const arr = Object.entries(await forumRes.json());
            var forums = [];
            

            for(var i = 0; i < arr.length; i++){
                console.log(arr[i][1]['creatID']);
                if(arr[i][1]['creatID'] == parseInt(sessionStorage.getItem('loginID')))
                    forums.push(Object.values(arr[i][1]));
                }

                document.cookie = `forumInfo=${encodeURIComponent(JSON.stringify(forums))}`;

        }
        window.location.reload(); // Force a page reload
    } catch (err) {
        console.error('Error deleting forum:', err);
        throw err; 
    }
}

function displayInfo(info){ //For displaying corresponding username, email, and pfp

    const displayUserName = document.querySelector('.profile-username h2'); //get contents of h2 in profile-username div class in index_userprofile.html
    const displayEmail = document.querySelector('.profile-username h3'); //get contents of h3 in profile-username div class in index_userprofile.html
    const displayProfile = document.querySelector('.profile-img'); //get contents of img element profile-img class in index_userprofile.html


    displayUserName.textContent = info[2]; //display username (ex. "Ava Lee") to index_userprofile.html
    displayEmail.textContent = info[3]; //display email (ex. "hannahcorpuz2003@gmail.com") to index_userprofile.html
    displayProfile.src = info[5]; //display corresponding pfp of user to index_userprofile.html
    
}

document.addEventListener("DOMContentLoaded", function () {
    const createForumButton = document.querySelector(".createforum-button");
    const profileInfo = document.querySelector(".hidden-div");
    const deactivateAccount = document.querySelector(".deactivate-account");
    const logout = document.querySelector(".logout");

    deactivateAccount.addEventListener("click",async function(){
        

        const res = await fetch(`/deleteUser/${userObject}`, {
            method:'DELETE'
        })
        sessionStorage.removeItem('path');
        sessionStorage.removeItem('loginObject');
        window.location.href = 'index.html';

    })

    logout.addEventListener("click", function () {
        // Clear all cookies
        document.cookie.split(";").forEach((cookie) => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    
        sessionStorage.removeItem("path");
        sessionStorage.removeItem("loginObject");
        sessionStorage.removeItem("loginInfo");
        sessionStorage.removeItem("loginForums");
        sessionStorage.removeItem("loginID");
    
        console.log("Cookies and session storage cleared.");
    
        window.location.href = "index.html";
    });

    const nameInfo = document.createTextNode("Username: ");
    const email = document.createTextNode("Email: ");
    const pfp = document.createTextNode("Choose one: ");
    const inputUsername = document.createElement('input');
    const inputEmail = document.createElement('input');
    const inputPFP = document.createElement('input');
    const submit = document.createElement('button');

    inputUsername.type = 'text';
    inputUsername.className = "newUsername";
    

    inputEmail.type = 'text';
    inputEmail.className = "newEmail";
    

    inputPFP.type = 'file';
    inputPFP.accept = '.jpg, .jpeg, .png';
    inputPFP.className = "newPFP";
    

    submit.className = "infoChanges";
    submit.appendChild(document.createTextNode("Submit"));
    submit.style.color = 'white';
    submit.style.backgroundColor = 'blue';
    submit.addEventListener("click", async function(){
        const updateUsername = document.querySelector(".newUsername");
        const updateEmail = document.querySelector(".newEmail");
        const updatePFP = document.querySelector(".newPFP");

        if (updateUsername.value === '' && updateEmail.value === '' && !updatePFP.files[0]) {
            alert("Please fill out at least one field to update.");
            return;
          }
        
          const formData = new FormData();
          if (updateUsername.value) formData.append("newUsername", updateUsername.value);
          if (updateEmail.value) formData.append("newEmail", updateEmail.value);
          if (updatePFP.files[0]) formData.append("newPFP", updatePFP.files[0]);
        
          console.log("FormData contents:", [...formData.entries()]); // Debugging log
        
          try {
            const res = await fetch(`/updateUser/${userObject}`, {
              method: 'POST',
              body: formData,
            });
        
            if (res.ok) {
              const updatedUser = await res.json();
              console.log("Updated User:", updatedUser);
        
              // Update the displayed user info
              displayInfo([
                null, // Placeholder for ID (not used in displayInfo)
                null, // Placeholder for another unused field
                updatedUser.name, // Username
                updatedUser.email, // Email
                null, // Placeholder for password (not used in displayInfo)
                updatedUser.picture // Profile picture
              ]);
        
              document.cookie = `userInfo=${updatedUser.ID},${updatedUser.name},${updatedUser.email},${updatedUser.password},${updatedUser.picture}; max-age=86400; path=/`;
              
              // Clear input fields
              updateUsername.value = '';
              updateEmail.value = '';
              updatePFP.value = '';

            } else {
              const error = await res.json();
              console.error("Error updating user:", error);
              alert(error.message || "Failed to update user.");
            }
          } catch (err) {
            console.error("Error updating user:", err);
            alert("An error occurred while updating the user.");
          }
        
    });

    profileInfo.appendChild(nameInfo);
    profileInfo.appendChild(inputUsername);
    profileInfo.appendChild(document.createElement('br'));
    profileInfo.appendChild(document.createElement('br'));
    profileInfo.appendChild(email);
    profileInfo.appendChild(inputEmail);
    profileInfo.appendChild(document.createElement('br'));
    profileInfo.appendChild(document.createElement('br'));
    profileInfo.appendChild(pfp);
    profileInfo.appendChild(inputPFP);
    profileInfo.appendChild(document.createElement('br'));
    profileInfo.appendChild(document.createElement('br'));
    profileInfo.appendChild(submit);

    var openEdit = 0;

    document.querySelector(".pfp-button").addEventListener("click", function(){
        const editProfile = document.querySelector(".hidden-div");

        if(openEdit == 0)
            {
                editProfile.style.display = 'block';
                openEdit = 1;
            }
            else{
                editProfile.style.display = 'none';
                openEdit = 0;
            }

    });


    if (createForumButton) {
        createForumButton.addEventListener("click", function () {
            window.location.href = "createforum.html"; // placeholder html
        });
    }

    


});

document.querySelector('.search-input').addEventListener('input', async (event) => {
    const searchQuery = event.target.value.trim(); 
    console.log('Search Query:', searchQuery); 

    const searchResults = document.getElementById('search-results'); 
    searchResults.innerHTML = ''; 

    if (searchQuery.length === 0) {
        return; 
    }

    try {
        const fetchURL = `/searchForums?q=${encodeURIComponent(searchQuery)}`;
        console.log('Fetch URL:', fetchURL); 

        const res = await fetch(fetchURL);
        if (res.ok) {
            const forums = await res.json();
            console.log('Matching Forums:', forums); 
            forums.forEach(forum => {
                const forumDiv = document.createElement('div');
                forumDiv.className = 'forum-container';

                // Display forum title and creator ID
                forumDiv.innerHTML = `
                    <a href="forum_post.html?forumID=${forum._id}">
                        <strong>${forum.title}</strong> <br>
                        <small>Created by: ${forum.creatID || 'Unknown'}</small>
                    </a>
                `;

                searchResults.appendChild(forumDiv);
            });
        } else {
            console.error('Failed to fetch search results');
        }
    } catch (err) {
        console.error('Error searching forums:', err);
    }
});


async function loadRecentForums() {
    try {
        const response = await fetch("/api/all-forums");
        const allForums = await response.json();

        console.log("Fetched All Forums:", allForums);

        if (!Array.isArray(allForums) || allForums.length === 0) {
            console.error("No forums found or invalid response:", allForums);
            return;
        }

        const sortedForums = allForums.sort((a, b) => b.forID - a.forID);

        const recentForums = sortedForums.slice(0, 3);

        console.log("Most Recent Forums:", recentForums);

        const recentForumsContainer = document.querySelector(".most-container .forum-container");

        recentForumsContainer.innerHTML = "";

        recentForums.forEach((forum) => {
            if (forum.forID && forum.title) {
                const forumElement = document.createElement("div");
                forumElement.classList.add("forum-container");

                // Generate a dynamic link with a query parameter
                forumElement.innerHTML = `<a href="forum_post.html?forumID=${forum._id}">${forum.title}</a>`;
                recentForumsContainer.appendChild(forumElement);
            } else {
                console.error("Invalid forum data:", forum);
            }
        });
    } catch (error) {
        console.error("Error loading recent forums:", error);
    }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", loadRecentForums);

async function loadPopularForums() {
    try {
        const response = await fetch("/api/popular");
        const popForums = await response.json();
  
        console.log("Fetched Top 5 Popular Forums:", popForums);
  
        if (!Array.isArray(popForums) || popForums.length === 0) {
            console.error("No popular forums found or invalid response:", popForums);
            return;
        }
  
        const popularContainer = document.querySelector("#popular-container");
        popularContainer.innerHTML = ""; 
  
        popForums.forEach(forum => {
            if (forum.forID && forum.title) {
                const forumElement = document.createElement("div");
                forumElement.classList.add("forum-container");
                forumElement.innerHTML = `<a href="forum_post.html?forumID=${forum.forID.toString()}">${forum.title}</a>`;
                popularContainer.appendChild(forumElement);
            } else {
                console.error("Invalid forum data:", forum);
            }
        });
    } catch (error) {
        console.error("Error loading top 5 popular forums:", error);
    }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", loadPopularForums);