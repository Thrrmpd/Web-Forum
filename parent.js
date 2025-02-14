function login() {
	const password = document.getElementById("password").value;
	const username  = document.getElementById("username").value;
	let emails = new Map([
		["helloworld", "john_doe@gmail.com"], 
		["goodbyemydei", "janefisher22@gmail.com"], 
		["hellomyworld", "jennyparker432@gmail.com"]
		]);
	let checker = 0;
	
	const keys = emails.keys();
	let a = 0;
	while(true){
		let result = keys.next();
		
			if(result.value == password && emails.get(password) == username) {
				checker+=1;
				break;
				}
				
			if(result.done)
				break;
	}
	
	
	if(checker == 1)
		window.location.replace("./index_userprofile.html");
	else
		alert("username or password might be wrong");
	
}

function goback() {
window.history.back();
}

function signup() {
	const password = document.getElementById("pwd").value;
	const username  = document.getElementById("nuname").value;
	const checkpwd  = document.getElementById("checkpwd").value;
	let emails = new Map([
		["helloworld", "john_doe@gmail.com"], 
		["goodbyemydei", "janefisher22@gmail.com"], 
		["hellomyworld", "jennyparker432@gmail.com"]
		]);
	let checkuname = 0;
	let checkpass = 0;
	const keys = emails.keys();
	
	while(true){
		let result = keys.next();
		
			if(emails.get(result.value) == username) {
			         checkuname+=1;
			         break;
				}
			else{
			     
				if(password != checkpwd)
				    {
					   checkpass+=1;
					   break;
					   
					}
			}
				
			if(result.done)
				break;
	}
	
	
	if(checkuname == 0 && checkpass == 0){
		window.location.replace("./index_userprofile.html");
		}
	else{
	       if(checkuname == 1)
		      alert("username already used");
		   else if(checkpass == 1)
	           alert("passwords don't match");
	   
	   }
	
	

}
