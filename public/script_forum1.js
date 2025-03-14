document.addEventListener("DOMContentLoaded", async function () {
  const forumDescription = document.getElementById("forumDescription");
  const postContainer = document.getElementById("postsContainer");

  // Fetch posts from backend
  async function loadPosts() {
    try {
      const response = await fetch("/getPosts");
      const posts = await response.json();
      postContainer.innerHTML = ""; // Clear posts before reloading

      posts.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.setAttribute("data-id", post._id);

        postDiv.innerHTML = `
          <small>Visibility: ${post.type}</small>
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <div class="edit-delete">
            <button onclick="editPost(this)">Edit</button>
            <button onclick="deletePost(this)">Delete</button>
          </div>
          <div class="comments-section">
            <input type="text" class="commentInput" placeholder="Write a comment...">
            <button onclick="addComment(this)">Comment</button>
            <div class="comments-container"></div>
          </div>
        `;

        postContainer.prepend(postDiv);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  // Load posts when page loads
  await loadPosts();
});

// CREATE POST
async function createPost() {
  const titleInput = document.getElementById("postTitle").value.trim();
  const contentInput = document.getElementById("postContent").value.trim();
  const visibilityInput = document.getElementById("postVisibility").value;

  if (!titleInput || !contentInput) {
    alert("Title and content are required!");
    return;
  }

  const newPost = {
    title: titleInput,
    description: contentInput,
    type: visibilityInput,
  };

  try {
    const response = await fetch("/addingPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      alert("Post created successfully!");
      location.reload();
    } else {
      alert("Failed to create post");
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

// UPDATE POST
async function editPost(button) {
  const postDiv = button.closest(".post");
  const postId = postDiv.getAttribute("data-id");

  const newTitle = prompt(
    "Edit Title:",
    postDiv.querySelector("h3").textContent
  );
  const newContent = prompt(
    "Edit Content:",
    postDiv.querySelector("p").textContent
  );

  if (!newTitle.trim() || !newContent.trim()) {
    alert("Title and content cannot be empty.");
    return;
  }

  try {
    const response = await fetch(`/updatePost/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newContent }),
    });

    if (response.ok) {
      alert("Post updated successfully!");
      location.reload();
    } else {
      alert("Failed to update post");
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

// DELETE POST
async function deletePost(button) {
  const postDiv = button.closest(".post");
  const postId = postDiv.getAttribute("data-id");

  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`/deletePost/${postId}`, { method: "DELETE" });

    if (response.ok) {
      alert("Post deleted successfully!");
      location.reload();
    } else {
      alert("Failed to delete post");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

// ADD COMMENT
function addComment(button) {
  const commentInput = button.previousElementSibling;
  const commentText = commentInput.value.trim();
  if (!commentText) return;

  const commentsContainer = button.nextElementSibling;
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");
  commentDiv.innerHTML = `
      <p>${commentText}</p>
      <div class="edit-delete">
        <button onclick="editComment(this)">Edit</button>
        <button onclick="deleteComment(this)">Delete</button>
      </div>
    `;

  commentsContainer.appendChild(commentDiv);
  commentInput.value = "";
}

// EDIT COMMENT
function editComment(button) {
  const comment = button.closest(".comment");
  const commentText = comment.querySelector("p");

  const newText = prompt("Edit Comment:", commentText.textContent);
  if (newText.trim() !== "") {
    commentText.textContent = newText;
  } else {
    alert("Comment cannot be empty.");
  }
}

// DELETE COMMENT
function deleteComment(button) {
  button.closest(".comment").remove();
}
