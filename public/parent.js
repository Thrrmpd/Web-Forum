

function login() { 
	const password = document.getElementById("password").value;
	const username  = document.getElementById("username").value;
	var isEqual = false;
	document.getElementById("loginbutton").addEventListener('click', async()=>{ //event listener where if user clicks login button then the function below will be executed
		const res = await fetch('/getUsers'); //fetch users from getUsers API
		const userdata = await res.json(); //returns object to userdata from res.json()
		var userentries = Object.entries(userdata); //returns array of key/value pairs to userentries 
		var index;
		//a single entry from userentries is an object
		

		var isEqual = false;

		try{
			

			const res = await fetch("/login", {
				method:'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email:username,
					password:password
				})
			})
	}catch{

	}
	/*try{
		const crypto = await import('bcrypt');
		for(let i = 0; i < userentries.length; i++){ //for loop check for validity
			if(username == Object.values(userentries[i][1])[3]){
				var compare = await crypto.compare(password, Object.values(userentries[i][1])[4]);
				console.log(compare);
				if(compare == true){
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
	}catch(err){
		console.log(err);

	}*/
		
		if(isEqual == true)
			{
				//sessionStorage.setItem('loginID', JSON.stringify(Object.values(userentries[index][1])[1])); //Stores user ID so that vars are passed between js and html pages
				
				//window.location.replace("./index_userprofile.html");
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



			try{
			

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
		}catch{

		}

			
			
			sessionStorage.setItem('loginID', JSON.stringify(ID));
			window.location.replace("./index_userprofile.html");
		}

		if(isEqual == true)
			alert("username already exists");
		else if(stringEqual == false)
			alert("passwords do not match");

	})

	
	

}
