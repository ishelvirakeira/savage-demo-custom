// Select all like buttons, trash buttons, and message div
const likeButtons = document.getElementsByClassName("fa-like-btn");
const trashButtons = document.getElementsByClassName("fa-trash");

// -----------------------------
// LIKE BUTTON FUNCTIONALITY
// -----------------------------
Array.from(likeButtons).forEach(function(button) {
  button.addEventListener('click', function() {
    // Traverse up from button to the parent <li class="recipe">
    const recipeLi = this.parentNode.parentNode; // button -> span -> li
    const title = recipeLi.querySelector(".title").innerText;
    const likesSpan = recipeLi.querySelector(".likescount");
    const currentLikes = parseInt(likesSpan.innerText);


    // Send PUT request to increment likes
    fetch('/recipes', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title})
    })
    .then(res => res.json())
    .then(updatedRecipe => {
      // Update likes count in DOM
      likesSpan.innerText = updatedRecipe.likes;
    })
    .catch(err => console.error(err));
  });
});

// -----------------------------
// DELETE BUTTON FUNCTIONALITY
// -----------------------------
Array.from(trashButtons).forEach(function(button) {
  button.addEventListener('click', function() {
    // Traverse up to <li class="recipe"> and get title
    const recipeLi = this.parentNode.parentNode; // button -> span -> li
    const title = recipeLi.querySelector(".title").innerText;

    // Send DELETE request to server
    fetch('/recipes', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title })
    })
    .then(res => res.json())
    .then(response => {
      if (response === 'No recipe to delete') {
        alert('No recipe to delete'); // show message to user
      } else {
        recipeLi.remove(); // remove the <li> from DOM immediately
      }
    })
    .catch(err => console.error(err));
  });
});
