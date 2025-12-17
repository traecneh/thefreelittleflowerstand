# The Free Little Flower Stand

This repository contains the source for **The Free Little Flower Stand**, a small community web site dedicated to sharing free flowers. The site is made entirely of static files: HTML, CSS, JavaScript and images.

## Project Structure

- `index.html` - Single-page site that lists posts and renders post details from `data/posts.json` (it can auto-open today's post if available).
- `data/posts.json` - Source of truth for each post: title, date, comparedate, content, and associated images/videos.
- `posts/` - Contains a subfolder for each post (e.g. `2024-09-08`) holding that post's media (images/videos).
- `about.html`, `donate.html`, and `posts/*/index.html` - Optional legacy pages (you can keep them as redirects to the SPA).
- `css/`, `js/`, `images/` and `assets/` - Supporting stylesheets, scripts, and images.

## Running Locally

Because the site loads data via JavaScript, it should be served over HTTP rather than opened directly from the filesystem. The simplest way is to use Python's built-in HTTP server:

```bash
python3 -m http.server
```

Then open `http://localhost:8000` in your browser.

## Adding a New Post

1. Create a new folder under `posts/` named with the post's date (e.g. `2024-10-01`).
2. Add any related images or videos in that folder.
3. Update `data/posts.json` with an entry describing the new post. Use `comparedate` as the post ID and deep-link format (`index.html#post=YYYY-MM-DD`).

## Contributing

Pull requests are welcome. Please follow the code style outlined in `AGENTS.md`.
