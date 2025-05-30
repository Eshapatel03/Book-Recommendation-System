const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
