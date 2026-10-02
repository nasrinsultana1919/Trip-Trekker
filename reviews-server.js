
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Load reviews
app.get('/api/reviews', (req, res) => {
  const data = fs.readFileSync('reviews.json', 'utf-8');
  res.json(JSON.parse(data));
});

// Save review
app.post('/api/reviews', (req, res) => {
  const { name, review, rating } = req.body;
  const date = new Date().toLocaleString();

  const newReview = { name, review, rating, date };
  let reviews = [];

  if (fs.existsSync('reviews.json')) {
    reviews = JSON.parse(fs.readFileSync('reviews.json'));
  }

  reviews.unshift(newReview); // Add to top
  fs.writeFileSync('reviews.json', JSON.stringify(reviews, null, 2));
  res.status(201).json({ message: 'Review saved' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
