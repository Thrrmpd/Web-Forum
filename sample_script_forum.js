document.addEventListener("DOMContentLoaded", function () {
  const forumDescription = document.getElementById("forumDescription");

  // Simulated dynamic forum description
  const descriptionText =
    "Welcome to the Psyduck Fan Forum! 🌊💛 Dive into discussions about everyone’s favorite confused duck! Share memes, theories, game strategies, and your best Psyduck moments. Whether you're a longtime fan or just curious, this is the place to quack about Psyduck!";
  forumDescription.textContent = descriptionText;

  // Add a sample post on load
  addSamplePost6();
  addSamplePost2();
  addSamplePost3();
  addSamplePost4();
  addSamplePost5();
  addSamplePost1();
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

function addSamplePost1() {
  const postContainer = document.getElementById("postsContainer");

  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  postDiv.innerHTML = `
    <small>Visibility: Public</small>
    <h3>Psyduck the Pokemon</h3>
    <p>Psyduck is a Water-type Pokémon from the Pokémon franchise. 
      It’s a yellow, duck-like creature with a constant headache, 
      which gives it powerful psychic abilities—though it struggles to control them. 
      Psyduck is known for its blank expression and tendency to hold its head in confusion. 
      It evolves into Golduck, a sleek, blue, more powerful Water/Psychic Pokémon..</p>
    <img src="Psyduck.jpg" alt="Post Image">
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
}

function addSamplePost2() {
  const postContainer = document.getElementById("postsContainer");

  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  postDiv.innerHTML = `
    <small>Visibility: Public</small>
    <h3>Why is Psyduck Always Confused?</h3>
    <p>I’ve always wondered why Psyduck looks so clueless all the time. 
    Is it just its nature, or is there an actual reason behind it? 
    I read that its headaches trigger psychic powers, but does that mean it’s in pain all the time? 
    Poor Psyduck! 😭</p>
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
}

function addSamplePost3() {
  const postContainer = document.getElementById("postsContainer");

  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  postDiv.innerHTML = `
    <small>Visibility: Public</small>
    <h3>Psyduck in the Anime – Underrated MVP!</h3>
    <p>People always laugh at Misty’s Psyduck, but let’s be real—it saved the team SO many times with 
    its unexpected Psychic moves! That battle against Team Rocket? Absolute gold. 
    Anyone else think Psyduck is lowkey OP?</p>
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
}

function addSamplePost4() {
  const postContainer = document.getElementById("postsContainer");

  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  postDiv.innerHTML = `
    <small>Visibility: Public</small>
    <h3>Psyduck vs Golduck – Which One is Better?</h3>
    <p>I know Golduck looks cooler and is stronger stat-wise, but something about Psyduck’s chaotic 
    energy just makes it more fun. Which do you prefer: the derpy Psyduck or the sleek Golduck? Let’s discuss!</p>
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
}

function addSamplePost5() {
  const postContainer = document.getElementById("postsContainer");

  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  postDiv.innerHTML = `
    <small>Visibility: Public</small>
    <h3>I Just Caught a Shiny Psyduck!</h3>
    <p>I can’t believe it! After hours of hunting, I finally caught a shiny Psyduck! 
    It’s blue instead of yellow, and it looks amazing. Anyone else have one? 
    Also, should I evolve it or keep it as a Psyduck? 🤔</p>
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
}

function addSamplePost6() {
  const postContainer = document.getElementById("postsContainer");

  const postDiv = document.createElement("div");
  postDiv.classList.add("post");

  postDiv.innerHTML = `
    <small>Visibility: Public</small>
    <h3>The Science Behind Psyduck’s Headaches</h3>
    <p>I read that Psyduck’s headaches are caused by its latent psychic abilities. 
    But if it can unleash powerful moves when stressed, does that mean it’s one of the strongest Pokémon in disguise? 
    Imagine if a Psyduck learned to control its power! 😲</p>
    <div class="edit-delete">
      <button onclick="editPost(this)">Edit</button>
      <button onclick="deletePost(this)">Delete</button>
    </div>
    <div class="comments-section">
      <input type="text" class="commentInput" placeholder="Write a comment...">
      <button onclick="addComment(this)">Comment</button>
      <div class="comments-container">
        <div class="comment">
          <p>"That’s a cool idea! Maybe Psyduck could have an alternate evolution where it masters its psychic abilities instead of evolving into Golduck. Like a Psychic/Water-type with insane special attack!"</p>
          <div class="edit-delete">
            <button onclick="editComment(this)">Edit</button>
            <button onclick="deleteComment(this)">Delete</button>
          </div>
        </div>
        <div class="comment">
          <p>Right? If Psyduck could consciously use its powers, it might even surpass Alakazam! But I guess its goofiness is part of its charm. 😂</p>
          <div class="edit-delete">
            <button onclick="editComment(this)">Edit</button>
            <button onclick="deleteComment(this)">Delete</button>
          </div>
        </div>
        <div class="comment">
          <p>This makes me wonder—do all Psyducks have the same potential, or are there some that naturally have stronger psychic abilities than others? Maybe nature vs. nurture applies to Pokémon too!</p>
          <div class="edit-delete">
            <button onclick="editComment(this)">Edit</button>
            <button onclick="deleteComment(this)">Delete</button>
          </div>
        </div>
        <div class="comment">
          <p>What if there was a storyline in a future Pokémon game where a Psyduck is trained by a powerful psychic trainer to control its abilities? That would be an awesome side quest!</p>
          <div class="edit-delete">
            <button onclick="editComment(this)">Edit</button>
            <button onclick="deleteComment(this)">Delete</button>
          </div>
        </div>
        <div class="comment">
          <p>I always felt bad for Psyduck because it looks like it’s suffering, but now I kind of see it as an underdog waiting for its full potential to awaken. Maybe one day!</p>
          <div class="edit-delete">
            <button onclick="editComment(this)">Edit</button>
            <button onclick="deleteComment(this)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;

  postContainer.prepend(postDiv);
}
