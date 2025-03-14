function login() {
	const password = document.getElementById("password").value;
	const username  = document.getElementById("username").value;
	var isEqual;
	document.getElementById("loginbutton").addEventListener('click', async()=>{
		const res = await fetch('/getUsers'); //fetch users from getUsers API
		const userdata = await res.json(); //returns object to userdata from res.json()
		var userentries = Object.entries(userdata); //returns array of key/value pairs to userentries 
		var index;
		//a single entry from userentries is an object
		

		for(let i = 0; i < userentries.length; i++){
			if(username == Object.values(userentries[i][1])[3]){
				if(password == Object.values(userentries[i][1])[4]){
					isEqual = true;
					index = i;
					break;
				}
				else{
					isEqual = false;
				}
			}else{
				isEqual = false;
			}
		}
		
		if(isEqual == true)
			{
				localStorage.setItem('loginID', JSON.stringify(Object.values(userentries[index][1])[1]));
				localStorage.setItem('path', '1');
				window.location.replace("./index_userprofile.html");
			}
		else
			alert("username or password might be wrong");

	})

	
	
}

function goback() {
window.history.back();
}

function signup() {
	const username = document.getElementById("username").value;
	const password = document.getElementById("pwd").value;
	const email  = document.getElementById("nuname").value;
	const checkpwd  = document.getElementById("checkpwd").value;
	var ID;
	var isEqual, stringEqual;
	document.getElementById("signupbutton").addEventListener('click', async()=>{
		const res = await fetch('/getUsers'); //fetch users from getUsers API
		const userdata = await res.json(); //returns object to userdata from res.json()
		var userentries = Object.entries(userdata); //returns array of key/value pairs to userentries 
		//a single entry from userentries is an object
		

		var k;

		for(let i = 0; i < userentries.length; i++){
			if(email == Object.values(userentries[i][1])[3]){
				isEqual = true;
				
				break;
			}else{
				isEqual = false;
				if(password == checkpwd)
					stringEqual = true;
				else {
					stringEqual = false;
				}
			}
			k = i;
		}

		 

		ID = Object.values(userentries[k][1])[1].valueOf() + 1
		if(isEqual == false && stringEqual == true){
			const res = await fetch("/addingUser", {
				method:'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					ID:ID,
					name:username,
					email:email,
					password:password
				})
			})

			const result = await res.json();
			localStorage.setItem('path', '2');
			window.location.replace("./index_userprofile.html");
		}

		if(isEqual == true)
			alert("username already exists");
		else if(stringEqual == false)
			alert("passwords do not match");

	})

	
	

}
