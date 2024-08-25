document.addEventListener('DOMContentLoaded', function() {
    // Load posts and attach event listeners
    fetch('data/posts.json')
        .then(response => response.json())
        .then(posts => {
            const arrangementsSection = document.getElementById('arrangements');

            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';

                let mediaHTML = '';

                const excerpt = post.content.split(' ').slice(0, 10).join(' ') + '...';

                if (index === 0) {
                    // Most recent post, show all data including images and videos
                    post.images.forEach(image => {
                        mediaHTML += `<img src="${image}" alt="Post Image" class="thumbnail-image">`;
                    });

                    post.videos.forEach(video => {
                        mediaHTML += `
                            <video controls class="thumbnail-image">
                                <source src="${video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>`;
                    });

                    postElement.innerHTML = `
                        <a href="${post.link}" class="post-link">
                            <p><strong>${post.date} - ${post.title}</strong></p>
                            <p>${excerpt}</p>
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

                // Add a separator inside the post element, except after the last post
                if (index < posts.length - 2) {
                    const separator = document.createElement('hr');
                    separator.className = 'post-separator';
                    postElement.appendChild(separator);
                }
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
