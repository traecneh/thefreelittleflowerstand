document.addEventListener('DOMContentLoaded', function() {
    // Load posts and attach event listeners
    fetch('data/posts.json')
        .then(response => response.json())
        .then(posts => {
            const arrangementsSection = document.getElementById('arrangements');

            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';

                const excerpt = post.content.split(' ').slice(0, 10).join(' ') + '...';

                if (index === 0) {
                    // Most recent post, show all data including images and videos
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

                    postElement.innerHTML = `
                        <h3><a href="${post.link}">${post.date} - ${post.title}</a></h3>
                        <p>${post.content}</p>
                        <a href="${post.link}">${mediaHTML}</a>
                    `;
                } else {
                    // Older posts, show only date, title, and an excerpt
                    postElement.innerHTML = `
                        <p><a href="${post.link}"><strong>${post.date} - ${post.title}</strong></a></p>
                        <p>${excerpt}</p>
                    `;
                }

                // Add the post element to the page
                arrangementsSection.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error loading posts:', error));
});
