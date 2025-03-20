
var userArray, forumArray, userObject, loggedinUsers, loggedinForums;

document.addEventListener("DOMContentLoaded", async ()=>{
    const pathway = localStorage.getItem('path');

    if(Object.entries(pathway)[0][1] == '1'){
        try{
        const userRes = await fetch('/getUsers');
        const forumRes = await fetch('/getForums');
        const loginRes = await fetch('/getLoggedIn');
        isLogin(userRes, forumRes, loginRes);

            }catch(err){
                console.error(err);
            }
        }
    else if(Object.entries(pathway)[0][1] == '2'){
        try{
            const userRes = await fetch('/getUsers');
            const forumRes = await fetch('/getForums');
            const loginRes = await fetch('/getLoggedIn');
            console.log(loginRes);
            
            isSignup(userRes, forumRes, loginRes);

                }catch(err){
                    console.error(err);
                }
    }
    
})

async function isSignup(userRes, forumRes, loginRes){ //signup function
    try{ //Try catch block needed in case promise error occurs because of fetch()

        
        const userdata = await userRes.json();//converts userRes to an object var to be passed to userData
       
        const forumdata = await forumRes.json(); //converts forumRes to an object var to be passed to forumData
        
        var userArray = Object.entries(userdata); //get array of objects from userdata
        var forumArray = Object.entries(forumdata); //get array of objects from forumdata
        var info = Object.values(userArray[userArray.length-1][1]); //Will change this, but otherwise gets corresponding user info array

        localStorage.setItem('loginID', info[0]); //STORES THE ID OF THE USER THAT LOGGED IN IN LOCAL STORAGE
        
        displayInfo(info); //display info

    }catch(err){
        console.error(err);
    }

}

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
    var index;
    console.log(forums);

    

    for(var i = 0; i < forums.length; i++)
    {

        const newDiv = document.createElement('div');
        const newSpan = document.createElement('span');
        const newButton = document.createElement('button');
        const forumDescription = document.createElement('div');


        newDiv.className = 'forum-entry';
        newSpan.className = 'forum-title';
        newButton.className = 'info-button';

        
        newSpan.textContent = forums[i][2];
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
        newDiv.appendChild(newButton);
        forumEntries.appendChild(newDiv);
        forumEntries.appendChild(forumDescription);

    }



}

function displayInfo(info){ //For displaying corresponding username, email, and pfp

    const displayUserName = document.querySelector('.profile-username h2'); //get contents of h2 in profile-username div class in index_userprofile.html
    const displayEmail = document.querySelector('.profile-username h3'); //get contents of h3 in profile-username div class in index_userprofile.html
    const displayProfile = document.querySelector('.profile-img'); //get contents of img element profile-img class in index_userprofile.html


    displayUserName.textContent = info[2]; //display username (ex. "Ava Lee") to index_userprofile.html
    displayEmail.textContent = info[3]; //display email (ex. "hannahcorpuz2003@gmail.com") to index_userprofile.html
    displayProfile.src = info[6]; //display corresponding pfp of user to index_userprofile.html
    
}

document.addEventListener("DOMContentLoaded", function () {
    const createForumButton = document.querySelector(".createforum-button");
    const profileInfo = document.querySelector(".hidden-div");
    const deactivateAccount = document.querySelector(".deactivate-account");

    deactivateAccount.addEventListener("click",async function(){
        

        const res = await fetch(`/deleteUser/${userObject}`, {
            method:'DELETE'
        })

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

        //console.log(updatePFP.files[0].name);

        
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


