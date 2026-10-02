// server.js
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const reviewsFile = path.join(__dirname, 'reviews', 'reviews.json');

// ✅ Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ GET reviews
app.get('/api/reviews', (req, res) => {
  fs.readFile(reviewsFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Read Error:', err);
      return res.json([]); // Return empty list if file missing or broken
    }

    try {
      const reviews = JSON.parse(data);
      res.json(reviews);
    } catch (e) {
      console.error('Parse Error:', e);
      res.json([]); // fallback if invalid JSON
    }
  });
});

// ✅ POST new review and send email
app.post('/api/reviews', (req, res) => {
  const newReview = req.body;
  console.log("Received review:", newReview);

  const dir = path.join(__dirname, 'reviews');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(reviewsFile)) fs.writeFileSync(reviewsFile, '[]');

  fs.readFile(reviewsFile, 'utf-8', (err, data) => {
    let reviews = [];
    if (!err && data) {
      try {
        reviews = JSON.parse(data);
      } catch (parseErr) {
        console.error("JSON Parse Error:", parseErr);
      }
    }

    reviews.unshift(newReview);

    fs.writeFile(reviewsFile, JSON.stringify(reviews, null, 2), err => {
      if (err) {
        console.error("Write Error:", err);
        return res.status(500).json({ error: 'Review saved, but email skipped due to write error.' });
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newReview.email,
        subject: 'Thanks for your review!',
        text: `Hi ${newReview.name},\n\nThank you for your feedback!\n\nRating: ${newReview.rating}\nComment: ${newReview.review}\n\nRegards,\nTripTrekKer`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email Error:", error);
          return res.json({ success: false, emailSent: false });
        }

        console.log("Email sent:", info.response);
        res.json({ success: true, emailSent: true });
      });
    });
  });
});

// ✅ Fallback route for frontend files
const actualPath = path.join(__dirname, 'actual.html');
app.get('*', (req, res) => {
  res.sendFile(actualPath);
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});