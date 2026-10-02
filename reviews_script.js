
const form = document.getElementById('reviewForm');
const reviewsSection = document.getElementById('reviewsSection');
const noReviewsText = document.querySelector('.no-reviews');

// Load reviews on page load
window.onload = () => {
  fetch('/api/reviews')
    .then(res => res.json())
    .then(reviews => {
      if (reviews.length === 0) return;
      if (noReviewsText) noReviewsText.remove();
      reviews.forEach(addReviewToDOM);
    });
};

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const reviewText = document.getElementById('review').value.trim();
  const rating = form.rating.value;

  if (!name || !reviewText || !rating) {
    alert('Please fill in all fields and select a rating.');
    return;
  }

  const reviewData = { name, review: reviewText, rating };

  fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  })
  .then(res => res.json())
  .then(() => {
    reviewData.date = new Date().toLocaleString();
    addReviewToDOM(reviewData);
    form.reset();
  });
});

function addReviewToDOM({ name, review, rating, date }) {
  const reviewDiv = document.createElement('div');
  reviewDiv.classList.add('review');

  const nameEl = document.createElement('div');
  nameEl.classList.add('name');
  nameEl.textContent = `${name} (${date})`;

  const starsEl = document.createElement('div');
  starsEl.classList.add('stars');
  starsEl.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const reviewEl = document.createElement('p');
  reviewEl.textContent = review;

  reviewDiv.appendChild(nameEl);
  reviewDiv.appendChild(starsEl);
  reviewDiv.appendChild(reviewEl);

  if (noReviewsText) noReviewsText.remove();

  reviewsSection.insertBefore(reviewDiv, reviewsSection.firstChild);
}
