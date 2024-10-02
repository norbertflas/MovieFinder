// server/models/User.js
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  movieId: { type: Number, required: true },
  rating: { type: Number, required: true }, // 1 dla "Lubię to", 0 dla "Nie Lubię"
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: { type: Object },
  ratings: [RatingSchema],
  watched: [Number], // Lista movieId
});

module.exports = mongoose.model('User', UserSchema);
