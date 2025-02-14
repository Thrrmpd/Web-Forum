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
		window.location.replace("./userpage.html");
	else
		alert("username or password might be wrong");
	
}

function goback() {
window.location.replace("./menu.html");
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
	let checker = 0;
	
	const keys = emails.keys();
	
	while(true){
		let result = keys.next();
		
			if(emails.get(result.value) == username) {
				break;
				}
			else{
				if(password == checkpwd)
					checker+=1;
					break;
			}
				
			if(result.done)
				break;
	}
	
	
	if(checker == 1)
		window.location.replace("./userpage.html");
	else
		alert("username already exists");
	
	

}
