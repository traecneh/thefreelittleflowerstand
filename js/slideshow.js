let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  const captionText = document.getElementById("caption");

  if (slides.length === 0) return;

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  // Hide & reset everything first
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    slide.style.display = "none";

    // Pause & reset any videos in this slide
    const vids = slide.getElementsByTagName("video");
    for (let v = 0; v < vids.length; v++) {
      vids[v].pause();
      // Reset to start; comment out if you prefer to remember position
      vids[v].currentTime = 0;
    }
  }

  // Show the active slide
  const active = slides[slideIndex - 1];
  active.style.display = "block";

  // If this slide has a video, autoplay it (muted + playsinline allows autoplay)
  const activeVideo = active.querySelector("video");
  if (activeVideo) {
    // Attempt to play; some browsers require a user gesture even when muted.
    activeVideo.play().catch(() => { /* ignore autoplay rejection */ });
  }

  // Set caption: prefer slide's data-caption, else media alt/label
  let caption = active.dataset.caption || "";
  if (!caption) {
    const media = active.querySelector("img, video");
    if (media) {
      caption =
        media.getAttribute("alt") ||
        media.getAttribute("aria-label") ||
        "";
    }
  }

  if (captionText) {
    captionText.innerHTML = caption;
  }
}
