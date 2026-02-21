const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    services: [String],
    type:     String,
    answers:  mongoose.Schema.Types.Mixed,
  },
  ratings: [
    {
      movieId: String,
      rating:  Number,
    },
  ],
  watched: [String],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
