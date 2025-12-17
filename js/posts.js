const BASE_TITLE = 'The Free Little Flower Stand';

let postsCache = [];

document.addEventListener('DOMContentLoaded', () => {
  initApp().catch((error) => {
    console.error('Error initializing site:', error);

    const arrangementsSection = document.getElementById('arrangements');
    if (arrangementsSection) {
      arrangementsSection.textContent = 'Sorry - posts could not be loaded right now.';
    }
  });
});

function getLocalIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function getExcerpt(text, maxWords) {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) return '';

  const words = cleaned.split(' ');
  if (words.length <= maxWords) return cleaned;
  return `${words.slice(0, maxWords).join(' ')}...`;
}

async function loadPosts() {
  const response = await fetch('data/posts.json');
  if (!response.ok) {
    throw new Error(`Failed to load posts.json (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function initApp() {
  postsCache = await loadPosts();
  postsCache.sort((a, b) => String(b.comparedate || '').localeCompare(String(a.comparedate || '')));

  maybeRedirectToToday(postsCache);

  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}

function maybeRedirectToToday(posts) {
  const queryParams = new URLSearchParams(window.location.search);
  const noRedirect = queryParams.has('noredirect');

  const hasHash = Boolean(window.location.hash && window.location.hash !== '#');
  if (noRedirect || hasHash) return;

  const today = getLocalIsoDate(new Date());
  const todayPost = posts.find((post) => post && post.comparedate === today);
  if (!todayPost) return;

  window.location.replace(`#post=${encodeURIComponent(today)}`);
}

function getViews() {
  return {
    home: document.getElementById('home'),
    post: document.getElementById('post'),
    donate: document.getElementById('donate'),
    about: document.getElementById('about'),
  };
}

function showView(views, activeView) {
  Object.entries(views).forEach(([name, el]) => {
    if (!el) return;
    el.hidden = name !== activeView;
  });
}

function parseRoute() {
  const raw = String(window.location.hash || '').replace(/^#/, '');
  const hash = raw.trim();

  if (!hash || hash === 'home') return { view: 'home' };
  if (hash === 'about') return { view: 'about' };
  if (hash === 'donate') return { view: 'donate' };

  if (hash.startsWith('post=')) {
    return { view: 'post', id: decodeURIComponent(hash.slice('post='.length)) };
  }

  return { view: 'home' };
}

function updateSiteNav(route) {
  const home = document.getElementById('nav-home');
  const donate = document.getElementById('nav-donate');
  const about = document.getElementById('nav-about');

  const links = {
    home,
    donate,
    about,
  };

  const activeView = route && route.view === 'post' ? 'home' : route && route.view ? route.view : 'home';

  Object.entries(links).forEach(([view, link]) => {
    if (!link) return;
    const isActive = view === activeView;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function setTitle(pageTitle) {
  document.title = pageTitle ? `${pageTitle} - ${BASE_TITLE}` : BASE_TITLE;
}

function setRandomAboutImage() {
  const aboutImage = document.getElementById('about-image');
  if (!aboutImage) return;

  const images = [
    'images/about-us/us-1.jpg',
    'images/about-us/us-2.jpg',
    'images/about-us/us-3.jpg',
    'images/about-us/us-4.jpg',
    'images/about-us/us-5.jpg',
    'images/about-us/us-6.jpg',
    'images/about-us/us-7.jpg',
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  aboutImage.src = images[randomIndex];
  aboutImage.loading = 'lazy';
  aboutImage.decoding = 'async';
}

function renderRoute() {
  const views = getViews();
  const route = parseRoute();

  updateSiteNav(route);

  if (route.view === 'home') {
    showView(views, 'home');
    setTitle('Home');
    renderPostList();
    window.scrollTo(0, 0);
    return;
  }

  if (route.view === 'about') {
    showView(views, 'about');
    setTitle('About');
    setRandomAboutImage();
    window.scrollTo(0, 0);
    return;
  }

  if (route.view === 'donate') {
    showView(views, 'donate');
    setTitle('Donate');
    window.scrollTo(0, 0);
    return;
  }

  if (route.view === 'post') {
    showView(views, 'post');
    renderPostDetail(route.id);
    window.scrollTo(0, 0);
    return;
  }

  showView(views, 'home');
  setTitle('Home');
  renderPostList();
  window.scrollTo(0, 0);
}

function renderPostList() {
  const arrangementsSection = document.getElementById('arrangements');
  if (!arrangementsSection) return;

  const posts = postsCache;
  arrangementsSection.innerHTML = '';

  if (!posts.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No posts yet - check back soon.';
    arrangementsSection.appendChild(emptyMessage);
    return;
  }

  posts.forEach((post, index) => {
    if (!post || !post.comparedate) return;

    const postElement = document.createElement('article');
    postElement.className = 'post';

    const postLink = document.createElement('a');
    postLink.className = 'post-link';
    postLink.href = `#post=${encodeURIComponent(post.comparedate)}`;

    const titleLine = document.createElement('p');
    const titleStrong = document.createElement('strong');
    titleStrong.textContent = [post.date, post.title].filter(Boolean).join(' - ');
    titleLine.appendChild(titleStrong);

    const excerptLine = document.createElement('p');
    excerptLine.textContent = getExcerpt(post.content, 24);

    postLink.appendChild(titleLine);
    if (excerptLine.textContent) postLink.appendChild(excerptLine);

    if (index === 0) {
      const mediaSummary = createMediaSummary(post);
      if (mediaSummary) postLink.appendChild(mediaSummary);
    }

    postElement.appendChild(postLink);
    arrangementsSection.appendChild(postElement);

    if (index < posts.length - 1) {
      const separator = document.createElement('hr');
      separator.className = 'post-separator';
      arrangementsSection.appendChild(separator);
    }
  });
}

function createMediaSummary(post) {
  const images = ensureArray(post.images);
  const videos = ensureArray(post.videos);

  const wrapper = document.createElement('div');
  wrapper.className = 'post-media';

  const firstImage = images[0];
  if (typeof firstImage === 'string' && firstImage) {
    const img = document.createElement('img');
    img.src = firstImage;
    img.alt = post.title ? `Thumbnail for ${post.title}` : 'Post thumbnail';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'thumbnail-image';
    wrapper.appendChild(img);
  }

  const parts = [];
  if (images.length) parts.push(`${images.length} photo${images.length === 1 ? '' : 's'}`);
  if (videos.length) parts.push(`${videos.length} video${videos.length === 1 ? '' : 's'}`);

  if (parts.length) {
    const counts = document.createElement('p');
    counts.className = 'media-counts';
    counts.textContent = parts.join(' · ');
    wrapper.appendChild(counts);
  }

  if (!wrapper.childNodes.length) return null;
  return wrapper;
}

function renderPostDetail(postId) {
  const postDetail = document.getElementById('post-detail');
  if (!postDetail) return;

  postDetail.innerHTML = '';

  const post = postsCache.find((p) => p && p.comparedate === postId);
  if (!post) {
    updatePostNavLinks(null);
    const message = document.createElement('p');
    message.textContent = 'Sorry - that post could not be found.';
    postDetail.appendChild(message);
    setTitle('Post Not Found');
    return;
  }

  setTitle(post.title || post.date || 'Post');
  updatePostNavLinks(post.comparedate);

  const title = document.createElement('h2');
  title.className = 'post-title';
  title.textContent = post.title || '';

  const date = document.createElement('p');
  date.className = 'post-date';
  date.textContent = post.date || post.comparedate || '';

  postDetail.appendChild(title);
  postDetail.appendChild(date);

  renderPostContent(postDetail, post.content);
  renderPostMedia(postDetail, post);
}

function updatePostNavLinks(postId) {
  const newerLink = document.getElementById('post-newer');
  const olderLink = document.getElementById('post-older');
  if (!newerLink || !olderLink) return;

  const posts = postsCache.filter((p) => p && p.comparedate);
  const index = postId ? posts.findIndex((p) => p.comparedate === postId) : -1;

  const newerPost = index > 0 ? posts[index - 1] : null;
  const olderPost = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

  setPostNavLink(newerLink, newerPost);
  setPostNavLink(olderLink, olderPost);
}

function setPostNavLink(linkEl, post) {
  if (!post) {
    linkEl.hidden = true;
    linkEl.removeAttribute('href');
    linkEl.removeAttribute('title');
    linkEl.removeAttribute('aria-label');
    return;
  }

  linkEl.hidden = false;
  linkEl.href = `#post=${encodeURIComponent(post.comparedate)}`;

  const label = [post.date, post.title].filter(Boolean).join(' - ') || post.comparedate;
  linkEl.title = label;
  linkEl.setAttribute('aria-label', label);
}

function renderPostContent(container, content) {
  const raw = String(content || '').trim();
  if (!raw) return;

  const paragraphs = raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  paragraphs.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    container.appendChild(p);
  });
}

function renderPostMedia(container, post) {
  const images = ensureArray(post.images);
  const videos = ensureArray(post.videos);

  if (!images.length && !videos.length) return;

  const carousel = createPostCarousel(post);
  if (carousel) container.appendChild(carousel);
}

function restoreScrollPosition(x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  if (window.scrollX === x && window.scrollY === y) return;
  window.scrollTo(x, y);
}

function preventScrollJump(action, baseline) {
  const fallbackX = window.scrollX;
  const fallbackY = window.scrollY;

  const x = baseline && Number.isFinite(baseline.x) ? baseline.x : fallbackX;
  const y = baseline && Number.isFinite(baseline.y) ? baseline.y : fallbackY;

  action();

  restoreScrollPosition(x, y);

  requestAnimationFrame(() => {
    restoreScrollPosition(x, y);
  });

  setTimeout(() => {
    restoreScrollPosition(x, y);
  }, 0);
}

function createPostCarousel(post) {
  const images = ensureArray(post.images);
  const videos = ensureArray(post.videos);

  const items = [];
  videos.forEach((src) => items.push({ type: 'video', src }));
  images.forEach((src) => items.push({ type: 'image', src }));

  const filteredItems = items.filter((item) => typeof item.src === 'string' && item.src);
  if (!filteredItems.length) return null;

  const scrollLock = {
    x: 0,
    y: 0,
    hasValue: false,
  };

  function lockScrollPosition() {
    scrollLock.x = window.scrollX;
    scrollLock.y = window.scrollY;
    scrollLock.hasValue = true;
  }

  function consumeScrollPosition() {
    if (!scrollLock.hasValue) return null;
    scrollLock.hasValue = false;
    return { x: scrollLock.x, y: scrollLock.y };
  }

  function wireControlScrollLock(control) {
    control.addEventListener('mousedown', (event) => {
      lockScrollPosition();
      event.preventDefault();
    });

    control.addEventListener(
      'touchstart',
      () => {
        lockScrollPosition();
      },
      { passive: true }
    );
  }

  const carousel = document.createElement('div');
  carousel.className = 'container post-carousel';
  carousel.dataset.slideIndex = '1';
  carousel.tabIndex = 0;
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Post media carousel');

  filteredItems.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'mySlides';

    const numberText = document.createElement('div');
    numberText.className = 'numbertext';
    numberText.textContent = `${index + 1} / ${filteredItems.length}`;
    slide.appendChild(numberText);

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.className = 'slide-media';
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';

      const source = document.createElement('source');
      source.src = item.src;
      source.type = 'video/mp4';

      video.appendChild(source);
      video.appendChild(document.createTextNode('Your browser does not support the video tag.'));
      slide.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = post.title ? post.title : 'Post image';
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      slide.appendChild(img);
    }

    carousel.appendChild(slide);
  });

  if (filteredItems.length > 1) {
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'prev';
    prev.setAttribute('aria-label', 'Previous media');
    prev.textContent = 'Prev';

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'next';
    next.setAttribute('aria-label', 'Next media');
    next.textContent = 'Next';

    wireControlScrollLock(prev);
    wireControlScrollLock(next);

    prev.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      preventScrollJump(() => changeCarouselSlide(carousel, -1), consumeScrollPosition());
    });

    next.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      preventScrollJump(() => changeCarouselSlide(carousel, 1), consumeScrollPosition());
    });

    carousel.appendChild(prev);
    carousel.appendChild(next);

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';

    filteredItems.forEach((_item, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to media ${index + 1} of ${filteredItems.length}`);
      wireControlScrollLock(dot);
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        preventScrollJump(() => showCarouselSlide(carousel, index + 1), consumeScrollPosition());
      });
      dots.appendChild(dot);
    });

    carousel.appendChild(dots);

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        preventScrollJump(() => changeCarouselSlide(carousel, -1), { x: window.scrollX, y: window.scrollY });
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        preventScrollJump(() => changeCarouselSlide(carousel, 1), { x: window.scrollX, y: window.scrollY });
      }
    });

    let touchStartX = 0;
    carousel.addEventListener(
      'touchstart',
      (event) => {
        lockScrollPosition();
        const touch = event.changedTouches[0];
        if (touch) touchStartX = touch.clientX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      'touchend',
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - touchStartX;
        if (Math.abs(deltaX) < 50) return;

        preventScrollJump(() => changeCarouselSlide(carousel, deltaX > 0 ? -1 : 1), consumeScrollPosition());
      },
      { passive: true }
    );
  }

  showCarouselSlide(carousel, 1);
  return carousel;
}

function getCarouselSlideIndex(carousel) {
  const current = Number(carousel.dataset.slideIndex || '1');
  return Number.isFinite(current) ? current : 1;
}

function changeCarouselSlide(carousel, delta) {
  const current = getCarouselSlideIndex(carousel);
  showCarouselSlide(carousel, current + delta);
}

function showCarouselSlide(carousel, index) {
  const slides = Array.from(carousel.getElementsByClassName('mySlides'));
  if (!slides.length) return;

  let nextIndex = index;
  if (nextIndex > slides.length) nextIndex = 1;
  if (nextIndex < 1) nextIndex = slides.length;

  slides.forEach((slide) => {
    slide.style.display = 'none';
    slide.querySelectorAll('video').forEach((video) => {
      video.pause();
    });
  });

  slides[nextIndex - 1].style.display = 'block';
  carousel.dataset.slideIndex = String(nextIndex);
  updateCarouselDots(carousel, nextIndex);
}

function updateCarouselDots(carousel, activeIndex) {
  const dots = Array.from(carousel.getElementsByClassName('carousel-dot'));
  if (!dots.length) return;

  dots.forEach((dot, index) => {
    const isActive = index === activeIndex - 1;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}
