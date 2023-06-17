const feedContainer = document.getElementById('feedContainer');
const lightboxContainer = document.getElementById('lightboxContainer');
const lightboxImage = document.getElementById('lightboxImage');
const closeBtn = document.querySelector('.close-button');
const darkModeCheckbox = document.getElementById('darkModeCheckbox');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let posts = [];
let visiblePosts = 4;
const postsPerLoad = 4;
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Fetch data from JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    posts = data;
    displayPosts();
  })
  .catch(error => {
    console.error('Error fetching JSON data:', error);
  });

// Display initial posts
function displayPosts() {
  const visiblePostsData = posts.slice(0, visiblePosts);
  feedContainer.innerHTML = ''; // Clear previous posts

  visiblePostsData.forEach((post) => {
    const card = createCard(post);
    feedContainer.appendChild(card);
  });

  if (visiblePosts >= posts.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }

  // Lazy Load images
  const lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy',
  });
}

// Create a card element for a post
function createCard(post) {
  const card = document.createElement('div');
  card.classList.add('card');

  const profileContainer = document.createElement('div');
  profileContainer.classList.add('profile-container');

  const profileImage = document.createElement('img');
  profileImage.src = post.profile_image;
  profileImage.alt = 'Profile Image';
  profileImage.classList.add('profile-image');
  profileContainer.appendChild(profileImage);

  const name = document.createElement('p');
  name.textContent = post.name;
  card.appendChild(profileContainer);
  card.appendChild(name);

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('image-wrapper');

  const image = document.createElement('img');
  image.classList.add('lazy');
  image.setAttribute('data-src', post.image);
  image.alt = 'Post Image';
  image.addEventListener('click', () => {
    openLightbox(post.image);
  });
  imageWrapper.appendChild(image);
  card.appendChild(imageWrapper);

  const caption = document.createElement('p');
  caption.textContent = post.caption;
  card.appendChild(caption);

  const source = document.createElement('p');
  const sourceLink = document.createElement('a');
  sourceLink.href = post.source_link;
  sourceLink.target = '_blank';
  sourceLink.textContent = post.source_type;
  source.appendChild(document.createTextNode('Source: '));
  source.appendChild(sourceLink);
  card.appendChild(source);

  const likesContainer = document.createElement('div');
  likesContainer.classList.add('likes-container');

  const likesCount = document.createElement('span');
  likesCount.classList.add('likes-count');
  likesCount.textContent = post.likes;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-button');
  likeButton.innerHTML = '<i class="fas fa-thumbs-up"></i>';
  likeButton.disabled = true; // Disable the button

  likesContainer.appendChild(likesCount);
  likesContainer.appendChild(likeButton);
  card.appendChild(likesContainer);

  const date = document.createElement('p');
  const formattedDate = formatDate(post.date);
  date.textContent = `Posted on: ${formattedDate}`;
  card.appendChild(date);

  return card;
}

// Load more posts
loadMoreBtn.addEventListener('click', () => {
  visiblePosts += postsPerLoad;
  displayPosts();
});

// Open image in lightbox
function openLightbox(imageUrl) {
  lightboxImage.src = imageUrl;
  lightboxContainer.style.display = 'flex';
}

// Close lightbox
closeBtn.addEventListener('click', () => {
  lightboxContainer.style.display = 'none';
});

// Toggle dark mode
toggleDarkMode(isDarkMode);

darkModeCheckbox.checked = isDarkMode; // Set checkbox state based on stored value

darkModeCheckbox.addEventListener('change', () => {
  isDarkMode = darkModeCheckbox.checked;
  toggleDarkMode(isDarkMode);
  localStorage.setItem('darkMode', isDarkMode); // Store dark mode state
});

// Format date string
function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
  const formattedTime = `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  return `${formattedDate} ${formattedTime}`;
}

// Pad zero to single-digit numbers
function padZero(number) {
  return number.toString().padStart(2, '0');
}

// Toggle dark mode styles
function toggleDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}
