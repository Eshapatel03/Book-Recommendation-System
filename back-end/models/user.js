const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  readingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  readingProgress: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      progress: { type: Number, default: 0 }, // progress percentage
    }
  ],
  preferences: [{ type: String }], // user preferences for personalized recommendations
});

module.exports = mongoose.model('User', UserSchema);
