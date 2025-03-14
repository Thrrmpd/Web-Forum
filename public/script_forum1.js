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
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");
  postDiv.dataset.id = post._id;

  postDiv.innerHTML = `
    <small>Visibility: ${post.type}</small>
    <h3>${post.title}</h3>
    <p>${post.description}</p>
    <div class="edit-delete">
      <button onclick="editPost(this)">Edit</button>
      <button onclick="deletePost(this)">Delete</button>
    </div>
  `;

  return postDiv;
}

async function createPost() {
  const title = document.getElementById("postTitle").value.trim();
  const description = document.getElementById("postContent").value.trim();
  const type = document.getElementById("postVisibility").value;
  const filename = document.getElementById("postFile")
    ? document.getElementById("postFile").value
    : ""; // Optional file input
  const creatorID = "0000"; // Fixed creator ID

  let postID;

  if (!title || !description) {
    alert("Title and content are required!");
    return;
  }

  try {
    // Fetch existing posts to determine postID
    const res = await fetch("/getPosts");
    const postsData = await res.json();
    const postsArray = Object.entries(postsData);

    if (postsArray.length > 0) {
      postID = Object.values(postsArray[postsArray.length - 1][1]).postID + 1;
    } else {
      postID = 1;
    }

    // Construct new post object
    const newPost = { postID, filename, description, title, type, creatorID };

    // Send request to add post
    const response = await fetch("/addingPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) throw new Error("Failed to create post");

    const createdPost = await response.json();
    document
      .getElementById("postsContainer")
      .prepend(createPostElement(createdPost));

    // Clear input fields after posting
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    if (document.getElementById("postFile")) {
      document.getElementById("postFile").value = "";
    }
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
