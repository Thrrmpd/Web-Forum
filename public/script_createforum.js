document.addEventListener("DOMContentLoaded", async () => {
  const loginID = localStorage.getItem('loginID');
  console.log('loginID from localStorage:', loginID); // NEED FOR DEBUGG

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
      console.log('No loginID found in localStorage');
  }
});

document.getElementById('createForumButton').addEventListener('click', async () => {
  const forumName = document.getElementById('forumName').value;
  const forumDescription = document.getElementById('forumDescription').value;
  const forumCode = document.getElementById('forumCode').value;
  const creatorID = localStorage.getItem('loginID'); // Get the logged-in user's ID

  // Validate input fields
  if (!forumName || !forumDescription || !forumCode) {
    alert('Please fill out all fields.');
    return;
  }

  try {
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
        creatID: creatorID
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
  localStorage.removeItem('loginID');
  window.location.href = 'index.html'; 
}

