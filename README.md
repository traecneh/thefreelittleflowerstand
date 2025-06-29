# The Free Little Flower Stand

This repository contains the source for **The Free Little Flower Stand**, a small community web site dedicated to sharing free flowers. The site is made entirely of static files: HTML, CSS, JavaScript and images.

## Project Structure

- `index.html` – Home page that lists blog posts from `data/posts.json` and automatically redirects to today's post if available.
- `about.html` – Information about the family behind the flower stand.
- `donate.html` – Instructions on how to donate jars, vases or flowers.
- `data/posts.json` – Metadata for each blog post, including its title, date, content, and associated images/videos.
- `posts/` – Contains a subfolder for each post (e.g. `2024-09-08`). Each folder holds an `index.html` and its related media.
- `css/`, `js/`, `images/` and `assets/` – Supporting stylesheets, scripts, and images.

## Running Locally

Because the site loads data via JavaScript, it should be served over HTTP rather than opened directly from the filesystem. The simplest way is to use Python's built-in HTTP server:

```bash
python3 -m http.server
```

Then open `http://localhost:8000` in your browser.

## Adding a New Post

1. Create a new folder under `posts/` named with the post's date (e.g. `2024-10-01`).
2. Add an `index.html` file and any related images or videos in that folder.
3. Update `data/posts.json` with an entry describing the new post, ensuring the `link` field points to the new HTML file.

## Contributing

Pull requests are welcome. Please follow the code style outlined in `AGENTS.md`.
