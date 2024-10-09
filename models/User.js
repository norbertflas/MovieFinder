// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    services: [String], // ['netflix', 'hulu', ...]
    type: String, // 'movie' or 'tv'
    answers: {
      genres: [String], // ['28', '35', ...]
      productionYearFrom: String,
      productionYearTo: String,
      // Dodaj więcej pól w razie potrzeby
    },
  },
  ratings: [
    {
      movieId: String,
      rating: Number, // 1 (Lubię to) or 0 (Nie Lubię)
    }
  ],
  watched: [String], // [movieId, ...]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
