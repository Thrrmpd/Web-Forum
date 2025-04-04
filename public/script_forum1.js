document.addEventListener("DOMContentLoaded", async () => {
  // Load forum data dynamically based on the forumID query parameter
  const params = new URLSearchParams(window.location.search);
  const forumID = params.get("forumID");

  if (!forumID) {
    alert("Forum ID is missing!");
    return;
  }

  try {
    // Fetch forum data from the backend
    const res = await fetch(`/getForum/${forumID}`);
    if (!res.ok) {
      throw new Error("Failed to fetch forum data");
    }

    const forumData = await res.json();
    console.log("Forum Data:", forumData);

    // Update the forum title and description
    document.getElementById("forumTitle").textContent = forumData.title;
    document.getElementById("forumDescription").textContent =
      forumData.description;
  } catch (err) {
    console.error("Error loading forum data:", err);
    alert("Failed to load forum data.");
  }

  // Handle user login state
  const loginID = sessionStorage.getItem("loginObject");
  console.log("loginID from sessionStorage:", loginID); // Debugging statement

  const navRight = document.getElementById("nav-right");
  console.log("navRight element:", navRight); // Debugging statement

  if (loginID) {
    try {
      const userRes = await fetch(`/getUser/${loginID}`);
      console.log("Response from /getUser endpoint:", userRes); // Debugging statement

      const userData = await userRes.json();
      console.log("User Data:", userData); // Debugging statement

      const userName = userData.name; // Assuming the user data has a 'name' field
      console.log("User Name:", userName); // Debugging statement

      navRight.innerHTML = `Logged in: <a href="index_userprofile.html"> ${userName}</a> | <a href="#" onclick="logout()">Log Out</a>`;
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  } else {
    console.log("No loginID found in sessionStorage");
  }
});

// Logout function
function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

// Add a comment
async function addComment(postID) {
  const userID = Number(sessionStorage.getItem("loginID"));

  // Check if logged in
  if (!userID) {
    alert("You need to be logged in to add a comment.");
    return; // Exit if not logged in
  }

  if (!postID) {
    console.error("Invalid postID:", postID);
    alert("Error: Invalid post ID.");
    return;
  }

  const commentInput = document.getElementById(`commentInput-${postID}`);
  const commentText = commentInput.value.trim();

  if (!commentText) {
    alert("Comment cannot be empty!");
    return;
  }

  try {
    const response = await fetch(`/addingComment/${postID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, text: commentText }),
    });

    if (!response.ok) throw new Error("Failed to add comment");

    const updatedPost = await response.json();

    renderUpdatedComments(postID, updatedPost.comments);

    commentInput.value = "";
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

// Read a comment
async function fetchComments(postID) {
  try {
    const response = await fetch(`/getComments/${postID}`);
    if (!response.ok) throw new Error("Failed to fetch comments");

    const comments = await response.json();
    const commentsContainer = document.getElementById(`comments-${postID}`);

    commentsContainer.innerHTML = comments.length
      ? comments
          .map(
            (comment) =>
              `<p class="comment"><b>User ${comment.userID}:</b> ${comment.text}</p>`
          )
          .join("")
      : '<p class="comment">No comments yet.</p>';
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

// Edit a comment
async function editComment(postID, commentID) {
  const userID = Number(sessionStorage.getItem("loginID"));

  // Check if logged in
  if (!userID) {
    alert("You need to be logged in to edit a comment.");
    return; // Exit if not logged in
  }

  const newText = prompt("Edit your comment:");

  if (!newText) return;

  try {
    const response = await fetch(`/updateComment/${postID}/${commentID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText, userID: userID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error);
      return;
    }

    const updatedPost = await response.json();
    renderUpdatedComments(postID, updatedPost.comments);
  } catch (error) {
    console.error("Error updating comment:", error);
  }
}

// Delete a comment
async function deleteComment(postID, commentID) {
  const userID = Number(sessionStorage.getItem("loginID"));

  // Check if logged in
  if (!userID) {
    alert("You need to be logged in to delete a comment.");
    return;
  }

  const confirmDelete = confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmDelete) {
    return; // If user cancels, do nothing
  }

  try {
    const response = await fetch(`/deleteComment/${postID}/${commentID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error);
      return;
    }

    const updatedPost = await response.json();
    renderUpdatedComments(postID, updatedPost.comments);
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

// Render again to reflect the updated comments
function renderUpdatedComments(postID, comments) {
  const commentsContainer = document.getElementById(`comments-${postID}`);
  commentsContainer.innerHTML = comments
    .map(
      (comment) => `
      <div class="comment-container">
        <p class="comment-text">
          <b>User ${comment.userID}:</b> ${comment.text}
        </p>
        <div class="comment-actions">
          <button onclick="editComment('${postID}', '${comment._id}')" class="action-btn">Edit</button>
          <button onclick="deleteComment('${postID}', '${comment._id}')" class="action-btn">Delete</button>
        </div>
      </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", function () {
  fetchPosts();
});

const API_URL = "http://localhost:3000";

async function fetchPosts() {
  const params = new URLSearchParams(window.location.search);
  const forumID = params.get("forumID");

  if (!forumID) {
    alert("Forum ID is missing!");
    return;
  }

  // Fetch forum data from the backend
  const res = await fetch(`/getForum/${forumID}`);
  if (!res.ok) {
    throw new Error("Failed to fetch forum data");
  }

  const forumData = await res.json();
  console.log("Forum Data:", forumData);

  const forID = forumData.forID;

  try {
    const response = await fetch(
      `${API_URL}/getPosts?forID=${encodeURIComponent(forID)}`
    );
    const posts = await response.json();

    const postContainer = document.getElementById("postsContainer");
    postContainer.innerHTML = "";

    posts.forEach((post) => {
      const postDiv = createPostElement(post);
      postContainer.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function createPostElement(post) {
  console.log("Post data in createPostElement:", post); // Debugging log

  const postDiv = document.createElement("div");
  postDiv.classList.add("post");
  postDiv.dataset.id = post._id; // Store the post ID properly

  postDiv.innerHTML = `
    <small>Visibility: ${post.type}</small>
    <h3>${post.title}</h3>
    <p>${post.description}</p>
    ${
      post.filename
        ? `<img src="${post.filename}" alt="Media" class="post-image" />`
        : ""
    }
    <div class="edit-delete">
      <button onclick="editPost(this)">Edit</button>
      <button onclick="deletePost(this)">Delete</button>
    </div>

    <div class="votes">
      <button class="vote-btn upvote-btn" data-postid="${post._id}">
        <i class="fas fa-thumbs-up"></i>
      </button>
      <span class="upvote-count" id="upvote-count-${post._id}">${
    post.upvotes
  }</span>

      <button class="vote-btn downvote-btn" data-postid="${post._id}">
        <i class="fas fa-thumbs-down"></i>
      </button>
      <span class="downvote-count" id="downvote-count-${post._id}">${
    post.downvotes
  }</span>
    </div>

    <div class="comments">
      <h4>Comments</h4>
      <div id="comments-${post._id}">
        ${
          post.comments && post.comments.length > 0
            ? post.comments
                .map(
                  (comment) => `
                  <div class="comment-container">
                    <p class="comment-text">
                      <b>User ${comment.userID}:</b> ${comment.text}
                    </p>
                    <div class="comment-actions">
                      <button onclick="editComment('${post._id}', '${comment._id}')" class="action-btn">Edit</button>
                      <button onclick="deleteComment('${post._id}', '${comment._id}')" class="action-btn">Delete</button>
                    </div>
                  </div>`
                )
                .join("")
            : '<p class="comment">No comments yet.</p>'
        }
      </div>
      <div class="comment-input">
        <input type="text" id="commentInput-${
          post._id
        }" placeholder="Write a comment..." />
        <button onclick="addComment('${post._id}')">Comment</button>
      </div>
    </div>
  `;

  return postDiv;
}

async function createPost() {
  const title = document.getElementById("postTitle").value.trim();
  const description = document.getElementById("postContent").value.trim();
  const type = document.getElementById("postVisibility").value;
  const creatorID = Number(sessionStorage.getItem("loginID")) || 0; // Convert to Number

  const params = new URLSearchParams(window.location.search);
  const forumID = params.get("forumID");

  if (!forumID) {
    alert("Forum ID is missing!");
    return;
  }

  if (!creatorID) {
    alert("You need to log in!");
    return;
  }

  // Fetch forum data from the backend
  const res = await fetch(`/getForum/${forumID}`);
  if (!res.ok) {
    throw new Error("Failed to fetch forum data");
  }

  const forumData = await res.json();
  console.log("Forum Data:", forumData);

  const forID = forumData.forID;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("type", type);
  formData.append("creatorID", creatorID);
  formData.append("forID", forID); 

  const fileInput = document.getElementById("postMedia");
  if (fileInput.files.length > 0) {
    formData.append("image", fileInput.files[0]);
  }

  try {
    const response = await fetch(`${API_URL}/addingPost`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to create post");

    const createdPost = await response.json();
    document
      .getElementById("postsContainer")
      .prepend(createPostElement(createdPost));

    // Clear input fields
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    document.getElementById("postMedia").value = "";
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

async function editPost(button) {
  const postDiv = button.closest(".post");
  const postId = postDiv.dataset.id;
  const title = postDiv.querySelector("h3").textContent;
  const description = postDiv.querySelector("p").textContent;

  const loggedInUserId = Number(sessionStorage.getItem("loginID"));

  if (!loggedInUserId) {
    alert("You need to be logged to edit post!");
    return;
  }

  const newTitle = prompt("Edit Title:", title);
  const newDescription = prompt("Edit Content:", description);

  if (!newTitle || !newDescription) {
    alert("Title and content cannot be empty.");
    return;
  }

  const updatedPost = { title: newTitle, description: newDescription };

  try {
    const response = await fetch(`${API_URL}/updatePost/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updatedPost, loggedInUserId }),
    });

    if (!response.ok) {
      // If the response is not OK, check the status code
      const errorData = await response.json();
      if (response.status === 403) {
        alert(errorData.error); // Show the error message sent by the server
      } else {
        throw new Error("Failed to update post");
      }
      return;
    }

    postDiv.querySelector("h3").textContent = newTitle;
    postDiv.querySelector("p").textContent = newDescription;
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

async function deletePost(button) {
  const postDiv = button.closest(".post");
  const postId = postDiv.dataset.id;
  const loggedInUserId = Number(sessionStorage.getItem("loginID"));

  const creatorID = Number(sessionStorage.getItem("loginID")) || 0; // Convert to Number

  if (!creatorID) {
    alert("You need to be logged to delete post!");
    return;
  }

  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`${API_URL}/deletePost/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loggedInUserId }), // Send logged-in user ID to the server
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 403) {
        alert(errorData.error); // Show error message from server
      } else {
        throw new Error("Failed to delete post");
      }
      return;
    }

    postDiv.remove();
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

async function loadPosts() {
  try {
    const res = await fetch("/getPosts");
    const posts = await res.json();
    const postsContainer = document.getElementById("posts-container");

    postsContainer.innerHTML = posts.map(renderPost).join("");

    attachVoteListeners();
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

function renderPost(post) {
  return `
    <div class="post" data-id="${post._id}">
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <div class="post-actions">
        <button class="delete-btn" data-postid="${post._id}">Delete</button>
        
        <div class="vote-buttons">
          <button class="upvote-btn" data-postid="${post._id}">↑</button>
          <span class="upvote-count">${post.upvotes}</span>
          <button class="downvote-btn" data-postid="${post._id}">↓</button>
          <span class="downvote-count">${post.downvotes}</span>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (event) => {
    const userID = Number(sessionStorage.getItem("loginID")) || 0; // 0 if not logged in

    if (!userID) {
      if (
        event.target.closest(".upvote-btn") ||
        event.target.closest(".downvote-btn")
      ) {
        alert("You must be logged in to vote.");
      }
      return;
    }

    // Upvote button clicked
    if (event.target.closest(".upvote-btn")) {
      const btn = event.target.closest(".upvote-btn");
      const postId = btn.getAttribute("data-postid");

      try {
        const res = await fetch(`/upvote/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userID }),
        });
        const data = await res.json();

        if (res.ok) {
          const upvoteCount = document.getElementById(`upvote-count-${postId}`);
          const downvoteCount = document.getElementById(
            `downvote-count-${postId}`
          );

          upvoteCount.textContent = data.upvotes;
          downvoteCount.textContent = data.downvotes;

          if (data.voted === "upvoted") {
            btn.disabled = true;
          } else {
            btn.disabled = false;
          }
        } else {
          console.error("Failed to upvote:", data);
        }
      } catch (error) {
        console.error("Error upvoting:", error);
      }
    }

    // Downvote button clicked
    if (event.target.closest(".downvote-btn")) {
      const btn = event.target.closest(".downvote-btn");
      const postId = btn.getAttribute("data-postid");

      try {
        const res = await fetch(`/downvote/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userID }),
        });
        const data = await res.json();

        if (res.ok) {
          const upvoteCount = document.getElementById(`upvote-count-${postId}`);
          const downvoteCount = document.getElementById(
            `downvote-count-${postId}`
          );

          upvoteCount.textContent = data.upvotes;
          downvoteCount.textContent = data.downvotes;

          if (data.voted === "downvoted") {
            btn.disabled = true;
          } else {
            btn.disabled = false;
          }
        } else {
          console.error("Failed to downvote:", data);
        }
      } catch (error) {
        console.error("Error downvoting:", error);
      }
    }
  });
});
