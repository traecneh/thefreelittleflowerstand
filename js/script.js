document.addEventListener('DOMContentLoaded', function() {
    // Load content into modal and apply gallery functionality
    function loadModalContent(post) {
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modal-body');
        const galleryItems = [...post.images, ...post.videos]; // Combine images and videos

        let currentIndex = 0;

        function showGalleryItem(index) {
            const item = galleryItems[index];
            modalContent.innerHTML = '';

            if (item.endsWith('.mp4')) {
                modalContent.innerHTML = `
                    <video controls class="fullsize">
                        <source src="${item}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
            } else {
                modalContent.innerHTML = `<img src="${item}" alt="Gallery Image" class="fullsize">`;
            }
        }

        // Show the first item
        showGalleryItem(currentIndex);

        // Handle next and previous
        document.getElementById('next').onclick = function() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            showGalleryItem(currentIndex);
        };

        document.getElementById('prev').onclick = function() {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showGalleryItem(currentIndex);
        };

        modal.style.display = 'block';
    }

    // Close modal when the close button is clicked
    const closeModal = document.querySelector('.close');
    closeModal.onclick = function() {
        document.getElementById('modal').style.display = 'none';
    };

    // Close modal when clicking outside the modal
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

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
                        <h3><p><strong>${post.date} - ${post.title}</strong></p></h3>
                        <p>${post.content}</p>
                        ${mediaHTML}
                    `;
                } else {
                    // Older posts, show only date, title, and an excerpt
                    postElement.innerHTML = `
                        <p><strong>${post.date} - ${post.title}</strong></p>
                        <p>${excerpt}</p>
                    `;
                }

                // Make the entire post clickable to open the gallery in the modal
                postElement.style.cursor = 'pointer';
                postElement.onclick = function(event) {
                    event.preventDefault();
                    loadModalContent(post);
                };

                arrangementsSection.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error loading posts:', error));
});
