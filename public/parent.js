function login() {
	const password = document.getElementById("password").value;
	const username  = document.getElementById("username").value;
	document.getElementById("loginbutton").addEventListener('click', async()=>{
		const res = await fetch('/getUsers'); //fetch users from getUsers API
		const userdata = await res.json(); //returns object to userdata from res.json()
		var userentries = Object.entries(userdata); //returns array of key/value pairs to userentries 
		//a single entry from userentries is an object
		var isEqual;

		for(let i = 0; i < userentries.length; i++){
			if(username == Object.values(userentries[i][1])[3]){
				if(password == Object.values(userentries[i][1])[4]){
					isEqual = true;
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
			window.location.replace("./index_userprofile.html");
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
	document.getElementById("signupbutton").addEventListener('click', async()=>{
		const res = await fetch('/getUsers'); //fetch users from getUsers API
		const userdata = await res.json(); //returns object to userdata from res.json()
		var userentries = Object.entries(userdata); //returns array of key/value pairs to userentries 
		//a single entry from userentries is an object
		var isEqual, stringEqual;

		var k;

		for(let i = 0; i < userentries.length; i++){
			if(email == Object.values(userentries[i][1])[3]){
				isEqual = true;
				break;
			}else{
				
				if(password == Object.values(userentries[i][1])[4]){
					isEqual = true;
					break;
				}
				else{
					isEqual = false;
					if(password == checkpwd)
						stringEqual = true;
				}
			}
			k = i;
		}

		

		var ID = Object.values(userentries[k][1])[1].valueOf() + 1
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
			alert(username);

			window.location.replace("./index_userprofile.html");
		}
		else if(stringEqual == false)
			alert("entered passwords do not match");
		else
			alert("username or password might be wrong");



	})
	

}
