const express = require('express');
const { getBooks, addBook, updateReadingProgress, getRecommendations } = require('../controllers/bookcontroller');

const { authenticate } = require('../middleware/authmiddleware');

const router = express.Router();

// Get all books
router.get('/', authenticate, getBooks);

// Add a new book (for demonstration purposes)
router.post('/', authenticate, addBook);

// Update reading progress
router.post('/progress', authenticate, updateReadingProgress);

// Get personalized recommendations
router.get('/recommendations', authenticate, getRecommendations);

module.exports = router;
