
const Book = require('../models/book');
const User = require('../models/user');

exports.getBooks = async (req, res) => {
    const books = await Book.find();
    res.json(books);
};

exports.addBook = async (req, res) => {
    const { title, author, summary } = req.body;
    const newBook = new Book({ title, author, summary });
    await newBook.save();
    res.status(201).json({ message: 'Book added' });
};

// Update reading progress for a book by a user
exports.updateReadingProgress = async (req, res) => {
    const userId = req.userId;
    const { bookId, progress } = req.body;

    if (progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const progressEntry = user.readingProgress.find(entry => entry.book.toString() === bookId);
        if (progressEntry) {
            progressEntry.progress = progress;
        } else {
            user.readingProgress.push({ book: bookId, progress });
        }

        await user.save();
        res.json({ message: 'Reading progress updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get personalized book recommendations based on user preferences and reading history
exports.getRecommendations = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('readingHistory');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simple recommendation logic: recommend books not in reading history
        // and matching user preferences if available
        let recommendedBooks;

        if (user.preferences && user.preferences.length > 0) {
            recommendedBooks = await Book.find({
                _id: { $nin: user.readingHistory.map(book => book._id) },
                // Assuming books have a 'category' field to match preferences
                category: { $in: user.preferences }
            });
        } else {
            recommendedBooks = await Book.find({
                _id: { $nin: user.readingHistory.map(book => book._id) }
            });
        }

        res.json(recommendedBooks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
