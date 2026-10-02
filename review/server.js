// server.js
require('dotenv').config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const nodemailer = require('nodemailer');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const reviewsFile = './reviews/reviews.json';

// ✅ Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Read reviews
app.get('/api/reviews', (req, res) => {
  fs.readFile(reviewsFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read reviews.' });
    res.json(JSON.parse(data));
  });
});

// ✅ Save new review and send email
app.post('/api/reviews', (req, res) => {
  const newReview = req.body;
  console.log("Received review:", newReview);

  fs.readFile(reviewsFile, 'utf-8', (err, data) => {
    if (err) {
      console.error("Read Error:", err);
      return res.status(500).json({ error: 'Could not load reviews.' });
    }

    let reviews;
    try {
      reviews = JSON.parse(data);
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr);
      return res.status(500).json({ error: 'Invalid JSON format in reviews.json' });
    }

    reviews.unshift(newReview);

    fs.writeFile(reviewsFile, JSON.stringify(reviews, null, 2), err => {
      if (err) {
        console.error("Write Error:", err);
        return res.status(500).json({ error: 'Could not save review.' });
      }

      // ✅ Send thank-you email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newReview.email,
        subject: 'Thanks for your review!',
        text: `Hi ${newReview.name},\n\nThank you for your feedback!\n\nRating: ${newReview.rating}\nComment: ${newReview.review}\n\nRegards,\nTripTrekKer`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email Error:", error);
          return res.status(500).json({ error: 'Review saved, but email failed.' });
        }

        console.log("Email sent:", info.response);
        res.status(200).json({ success: true });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});