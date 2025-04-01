
var userArray, forumArray, userObject, loggedinUsers, loggedinForums, pathway;

document.addEventListener("DOMContentLoaded", async ()=>{
    
        try{
        const userRes = await fetch('/getUsers');
        const forumRes = await fetch('/getForums');
        const loginRes = await fetch('/getLoggedIn');
        isLogin(userRes, forumRes, loginRes);

            }catch(err){
                console.error(err);
            }
    
})

async function isLogin(userRes, forumRes, loginRes){ //login function
    const ID = parseInt(localStorage.getItem('loginID')); //used this to get user data of user that logged in
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
                localStorage.setItem('loginObject', info[0]);
                break;
            }
        }

        for(var i = 0; i < forumArray.length; i++)
        {
            if(ID == Object.values(forumArray[i][1])[5]){
                forums.push(Object.values(forumArray[i][1]))
            }

        }
        
        userObject = info[0];
        console.log(userObject);

        localStorage.setItem('loginInfo', JSON.stringify(info));
        localStorage.setItem('loginForums', JSON.stringify(forums))

        displayInfo(info); 

        if(forums.length != 0)
            displayForums(forums, info[2]);

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
        localStorage.removeItem('path');
        localStorage.removeItem('loginObject');
        window.location.href = 'index.html';

    })

    logout.addEventListener("click", function(){
        localStorage.removeItem('path');
        console.log(localStorage.getItem('path'));
        pathway = 0;
        localStorage.removeItem('loginObject');
        window.location.href = 'index.html';
    })

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

        
        if(updateUsername.value == '' && updateEmail.value == '' && !updatePFP.files[0])
            alert("Please fill out at least one field to update.");
            else{
                const data = {};
                if(updateUsername.value) 
                    Object.assign(data, {newUsername: updateUsername.value});
                if(updateEmail.value) 
                    Object.assign(data, {newEmail: updateEmail.value});
                if(updatePFP.files[0]) 
                 Object.assign(data, {newPFP: updatePFP.files[0].name});

                console.log(data);

                const res = await fetch(`/updateUser/${userObject}`, {
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
        }
        
        window.location.reload();
        
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



