const form = document.getElementById('reviewForm');
const reviewsSection = document.getElementById('reviewsSection');
const noReviewsText = document.querySelector('.no-reviews');
const responseDiv = document.getElementById('response'); // ✅ Message box

function formatStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

function createReviewElement({ name, review, rating, timestamp }) {
  const reviewDiv = document.createElement('div');
  reviewDiv.className = 'review';

  const nameEl = document.createElement('div');
  nameEl.className = 'name';
  nameEl.textContent = `${name} (${new Date(timestamp).toLocaleString()})`;

  const starsEl = document.createElement('div');
  starsEl.className = 'stars';
  starsEl.textContent = formatStars(rating);

  const textEl = document.createElement('p');
  textEl.textContent = review;

  reviewDiv.append(nameEl, starsEl, textEl);
  return reviewDiv;
}

async function fetchReviews() {
  try {
    const res = await fetch('/api/reviews');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const reviews = await res.json();

    reviewsSection.innerHTML = '';
    if (reviews.length === 0) {
      reviewsSection.innerHTML = '<p class="no-reviews">Be the first to leave a review!</p>';
      return;
    }

    reviews.forEach(r => {
      reviewsSection.appendChild(createReviewElement(r));
    });
  } catch (err) {
    console.error('Error loading reviews:', err);
    reviewsSection.innerHTML = '<p class="error-message">⚠ Failed to load reviews.</p>';
  }
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  responseDiv.innerHTML = ''; // ✅ Clear previous message

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const reviewText = document.getElementById('review').value.trim();
  const rating = form.rating.value;

  if (!name || !email || !reviewText || !rating) {
    alert('Please fill in all fields and select a rating.');
    return;
  }

  const newReview = {
    name,
    email,
    review: reviewText,
    rating: parseInt(rating),
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    });

    const contentType = res.headers.get('content-type');
    const result = contentType && contentType.includes('application/json')
      ? await res.json()
      : {};

    if (res.ok && result.success) {
      form.reset();
      fetchReviews();

      responseDiv.innerHTML = `
        <div class="success-message">
          ✅ Thank you for your review!<br>
          <span class="email">Email sent to: ${email}</span>
        </div>
      `;
    } else {
      responseDiv.innerHTML = `
        <div class="error-message">
          ❌ Review saved, but failed to send email or wrong response format.
        </div>
      `;
    }
  } catch (error) {
    console.error("Submission error:", error);
    responseDiv.innerHTML = `
      <div class="error-message">
        ❌ Failed to submit review. Please try again later.
      </div>
    `;
  }
});

fetchReviews();