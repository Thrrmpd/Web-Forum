document.addEventListener("DOMContentLoaded", function () {
  const forumDescription = document.getElementById("forumDescription");

  // Simulated dynamic forum description
  const descriptionText = "Sample Forum Description";
  forumDescription.textContent = descriptionText;
});

function createPost() {
  const visibilityInput = document.getElementById("postVisibility");
  const titleInput = document.getElementById("postTitle");
  const contentInput = document.getElementById("postContent");
  const mediaInput = document.getElementById("postMedia");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const visibility = visibilityInput.value;
  const file = mediaInput.files[0];

  if (!title || !content) {
    alert("Title and content are required!");
    return;
  }

  const postContainer = document.getElementById("postsContainer");
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  postDiv.innerHTML = `
      <small>Visibility: ${visibility}</small>
      <h3>${title}</h3>
      <p>${content}</p>
      <div class="edit-delete">
        <button onclick="editPost(this)">Edit</button>
        <button onclick="deletePost(this)">Delete</button>
      </div>
      <div class="image-container"></div>
      <div class="comments-section">
        <input type="text" class="commentInput" placeholder="Write a comment...">
        <button onclick="addComment(this)">Comment</button>
        <div class="comments-container"></div>
      </div>
    `;

  postContainer.prepend(postDiv);

  if (file) {
    if (!["image/jpeg"].includes(file.type)) {
      alert("Only JPG and JPEG images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageContainer = postDiv.querySelector(".image-container");
      imageContainer.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
    };
    reader.readAsDataURL(file);
  }

  titleInput.value = "";
  contentInput.value = "";
  visibilityInput.value = "public";
  mediaInput.value = "";
}

function editPost(button) {
  const post = button.closest(".post");
  const title = post.querySelector("h3");
  const content = post.querySelector("p");

  const newTitle = prompt("Edit Title:", title.textContent);
  const newContent = prompt("Edit Content:", content.textContent);

  if (newTitle.trim() !== "" && newContent.trim() !== "") {
    title.textContent = newTitle;
    content.textContent = newContent;
  } else {
    alert("Title and content cannot be empty.");
  }
}

function deletePost(button) {
  button.closest(".post").remove();
}

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

function deleteComment(button) {
  button.closest(".comment").remove();
}
