const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// ✅ Serve static assets like CSS/JS from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Serve home.html at root '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// ✅ Serve review.html at /review
app.get('/review', (req, res) => {
  res.sendFile(path.join(__dirname, 'review.html'));
});

// ✅ API endpoint to get reviews
app.get('/api/reviews', (req, res) => {
  fs.readFile('reviews.json', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read reviews' });
    }
    res.json(JSON.parse(data));
  });
});

// ✅ API endpoint to post a review
app.post('/api/reviews', (req, res) => {
  const newReview = req.body;
  const currentDate = new Date().toLocaleString();
  newReview.date = currentDate;

  fs.readFile('reviews.json', (err, data) => {
    let reviews = [];
    if (!err && data.length > 0) {
      reviews = JSON.parse(data);
    }
    reviews.unshift(newReview);
    fs.writeFile('reviews.json', JSON.stringify(reviews, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save review' });
      }
      res.status(201).json({ message: 'Review saved successfully' });
    });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});