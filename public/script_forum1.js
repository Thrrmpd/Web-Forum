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
  const loginID = localStorage.getItem("loginObject");
  console.log("loginID from localStorage:", loginID); // Debugging statement

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
    console.log("No loginID found in localStorage");
  }
});

// Add a comment
async function addComment(postID) {
  if (!postID) {
    console.error("Invalid postID:", postID);
    alert("Error: Invalid post ID.");
    return;
  }

  const commentInput = document.getElementById(`commentInput-${postID}`);
  const commentText = commentInput.value.trim();
  const userID = Number(localStorage.getItem("loginID")) || 0; // Convert to Number

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

    const updatedPost = await response.json(); // Fetch updated comments

    renderUpdatedComments(postID, updatedPost.comments); // Re-render all comments

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
  const newText = prompt("Edit your comment:");

  if (!newText) return;

  try {
    const response = await fetch(`/updateComment/${postID}/${commentID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });

    if (!response.ok) throw new Error("Failed to update comment");

    const updatedPost = await response.json();

    renderUpdatedComments(postID, updatedPost.comments);
  } catch (error) {
    console.error("Error updating comment:", error);
  }
}

// Delete a comment
async function deleteComment(postID, commentID) {
  try {
    const response = await fetch(`/deleteComment/${postID}/${commentID}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete comment");

    const updatedPost = await response.json();

    renderUpdatedComments(postID, updatedPost.comments); // Re-render comments
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
  try {
    const response = await fetch(`${API_URL}/getPosts`);
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
    <div class="edit-delete">
      <button onclick="editPost(this)">Edit</button>
      <button onclick="deletePost(this)">Delete</button>
    </div>

    <div class="votes">
      <button class="vote-btn upvote-btn" data-postid="${post._id}">
        <i class="fas fa-thumbs-up"></i>
      </button>
      <span class="upvote-count" id="upvote-count-${post._id}">${post.upvotes}</span>

      <button class="vote-btn downvote-btn" data-postid="${post._id}">
        <i class="fas fa-thumbs-down"></i>
      </button>
      <span class="downvote-count" id="downvote-count-${post._id}">${post.downvotes}</span>
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
  const filename = document.getElementById("postMedia").value || "";
  const creatorID = Number(localStorage.getItem("loginID")) || 0; // Convert to Number

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

  const newPost = { title, description, type, filename, creatorID, forID };

  try {
    const response = await fetch(`${API_URL}/addingPost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
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

  const newTitle = prompt("Edit Title:", title);
  const newDescription = prompt("Edit Content:", description);

  if (!newTitle || !newDescription) {
    alert("Title and content cannot be empty.");
    return;
  }

  const updatedPost = { title: newTitle, description: newDescription };

  try {
    const response = await fetch(`${API_URL}/updatePost/${postId}`, {
      method: "POST", //
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) throw new Error("Failed to update post");

    postDiv.querySelector("h3").textContent = newTitle;
    postDiv.querySelector("p").textContent = newDescription;
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

async function deletePost(button) {
  const postDiv = button.closest(".post");
  const postId = postDiv.dataset.id;

  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`${API_URL}/deletePost/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete post");

    postDiv.remove();
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

async function loadPosts() {
  try {
    const res = await fetch("/getPosts"); // This route fetches posts from your backend
    const posts = await res.json();
    const postsContainer = document.getElementById("posts-container");

    // Render posts dynamically
    postsContainer.innerHTML = posts.map(renderPost).join("");

    // Attach upvote/downvote listeners after rendering
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

document.querySelectorAll(".upvote-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const postId = btn.getAttribute("data-post-id");

      try {
        const res = await fetch(`/upvote/${postId}`, { method: "PUT" });
        const data = await res.json();

        if (res.ok) {
          // Find the element displaying the upvote count and update it
          const voteCount = btn.closest(".post").querySelector(".upvote-count");
          voteCount.textContent = data.upvotes;
        } else {
          console.error("Failed to upvote:", data);
        }
      } catch (error) {
        console.error("Error upvoting:", error);
      }
    });
});

  document.querySelectorAll(".downvote-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const postId = btn.getAttribute("data-post-id");

      try {
        const res = await fetch(`/downvote/${postId}`, { method: "PUT" });
        const data = await res.json();

        if (res.ok) {
          // Find the element displaying the downvote count and update it
          const voteCount = btn.closest(".post").querySelector(".downvote-count");
          voteCount.textContent = data.downvotes;
        } else {
          console.error("Failed to downvote:", data);
        }
      } catch (error) {
        console.error("Error downvoting:", error);
      }
    });
});

// Logout function
function logout() {
  localStorage.removeItem("loginID");
  window.location.href = "index.html"; // Redirect to the main page
}
