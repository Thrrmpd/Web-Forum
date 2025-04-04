document.addEventListener("DOMContentLoaded", async () => {
  const loginID = sessionStorage.getItem('loginObject');
  console.log('loginID from sessionStorage:', loginID); // NEED FOR DEBUGG

  const navRight = document.getElementById('nav-right');
  console.log('navRight element:', navRight); // another debug

  if (loginID) {
      try {
          const userRes = await fetch(`/getUser/${loginID}`); 
          console.log('Response from /getUser endpoint:', userRes); // debug

          const userData = await userRes.json();
          console.log('User Data:', userData); // console debug

          const userName = userData.name; // name
          console.log('User Name:', userName); // console debuf

          navRight.innerHTML = `Logged in: ${userName} | <a href="#" onclick="logout()">Log Out</a>`; // change and display user name and logout link
      } catch (err) {
          console.error('Error fetching user data:', err);
      }
  } else {
      console.log('No loginID found in sessionStorage');
  }
});

document.getElementById('createForumButton').addEventListener('click', async () => {
  const forumName = document.getElementById('forumName').value;
  const forumDescription = document.getElementById('forumDescription').value;
  const forumCode = document.getElementById('forumCode').value;

  // Get the MongoDB _id from sessionStorage
  const loginObject = sessionStorage.getItem('loginObject');
  console.log("loginObject from sessionStorage:", loginObject); // Debugging statement

  if (!loginObject) {
    alert("Error: You are not logged in. Please log in again.");
    return;
  }

  try {
    // Fetch the user data to get the correct ID
    const userRes = await fetch(`/getUser/${loginObject}`);
    if (!userRes.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userRes.json();
    console.log("User Data:", userData); // Debugging statement

    const creatorID = userData.ID; // Extract the user ID (e.g., 1007)
    console.log("creatorID:", creatorID); // Debugging statement

    // Validate input fields
    if (!forumName || !forumDescription || !forumCode) {
      alert('Please fill out all fields.');
      return;
    }

    if (!creatorID) {
      alert("Error: Creator ID is missing. Please log in again.");
      return;
    }

    // Send the forum data to the backend
    const res = await fetch('/addingForums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: forumName,
        description: forumDescription,
        code: forumCode,
        creatID: creatorID // Use the correct user ID
      })
    });

    if (res.ok) {
      const forumData = await res.json();
      console.log('Forum created:', forumData);

      // Redirect to the new forum page
      window.location.href = `forum_post.html?forumID=${forumData._id}`;
    } else {
      const error = await res.json();
      alert(`Error: ${error.message}`);
    }
  } catch (err) {
    console.error('Error creating forum:', err);
    alert('An error occurred while creating the forum.');
  }
});

function logout() {
  sessionStorage.removeItem('path');
  sessionStorage.removeItem("loginObject");
  sessionStorage.removeItem("loginInfo");
  sessionStorage.removeItem("loginForums");
  sessionStorage.removeItem("loginID");

  document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  console.log("All cookies and session storage cleared.");

  // Redirect to the homepage or login page
  window.location.href = 'index.html';
}

