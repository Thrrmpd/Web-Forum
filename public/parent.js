


document.getElementById("loginbutton").addEventListener("click", async () => {
	const email = document.getElementById("username").value;
	const password = document.getElementById("password").value;
  
	try {
	  const res = await fetch("/login", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	  });
  
	  if (res.ok) {
		const data = await res.json();
		console.log("Login successful:", data);
  
		// Store user ID in session storage
		sessionStorage.setItem("loginID", data.user.id);
  
		// Redirect to the user profile page
		window.location.replace("./index_userprofile.html");
	  } else {
		const error = await res.json();
		console.error("Login failed:", error);
		alert(error.error || "Login failed. Please check your credentials.");
	  }
	} catch (err) {
	  console.error("Error during login:", err);
	  alert("An error occurred while logging in.");
	}
  });	


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
