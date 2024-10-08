document.addEventListener('DOMContentLoaded', function() {
    // Load posts and attach event listeners
    fetch('../../data/posts.json')
        .then(response => response.json())
        .then(posts => {
            const arrangementsSection = document.getElementById('arrangements');

            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';

                let mediaHTML = '';

                // Append images
                post.images.forEach(image => {
                    mediaHTML += `<img src="${image}" alt="Post Image" class="thumbnail">`;
                });

                // Append videos
                post.videos.forEach(video => {
                    mediaHTML += `
                        <video controls class="thumbnail">
                            <source src="${video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>`;
                });

                const excerpt = post.content.split(' ').slice(0, 10).join(' ') + '...';

                if (index === 0) {
                    // Most recent post, show all data including images and videos
                    postElement.innerHTML = `
                        <a href="${post.link}" class="post-link">
                            <h3><p><strong>${post.date} - ${post.title}</strong></p></h3>
                            <p>${post.content}</p>
                            ${mediaHTML}
                        </a>
                    `;
                } else {
                    // Older posts, show only date, title, and an excerpt
                    postElement.innerHTML = `
                        <a href="${post.link}" class="post-link">
                            <p><strong>${post.date} - ${post.title}</strong></p>
                            <p>${excerpt}</p>
                        </a>
                    `;
                }

                // Add the post element to the page
                arrangementsSection.appendChild(postElement);
            });

            // Make the entire post area clickable
            document.querySelectorAll('.post-link').forEach(function(postLink) {
                postLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    window.location.href = postLink.getAttribute('href');
                });
            });
        })
        .catch(error => console.error('Error loading posts:', error));
});

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}
