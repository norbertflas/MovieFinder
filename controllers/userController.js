// server/controllers/userController.js
const User = require('../models/User');

// Pobieranie ocen użytkownika
const getUserRatings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('ratings');
    res.status(200).json({ ratings: user.ratings });
  } catch (error) {
    console.error('Błąd podczas pobierania ocen:', error);
    res.status(500).json({ message: 'Wystąpił problem z pobraniem ocen.' });
  }
};

// Ocenianie filmu/serialu
const rateMovie = async (req, res) => {
  const { movieId, rating } = req.body;
  if (rating !== 1 && rating !== 0) {
    return res.status(400).json({ message: 'Nieprawidłowa ocena.' });
  }

  try {
    const user = await User.findById(req.user.id);
    const existingRatingIndex = user.ratings.findIndex(r => r.movieId === movieId);
    if (existingRatingIndex !== -1) {
      user.ratings[existingRatingIndex].rating = rating;
    } else {
      user.ratings.push({ movieId, rating });
    }
    await user.save();
    res.status(200).json({ message: 'Ocena zaktualizowana.' });
  } catch (error) {
    console.error('Błąd podczas oceniania:', error);
    res.status(500).json({ message: 'Wystąpił problem z ocenianiem.' });
  }
};

// Pobieranie obejrzanych utworów
const getUserWatched = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('watched');
    res.status(200).json({ watched: user.watched });
  } catch (error) {
    console.error('Błąd podczas pobierania obejrzanych utworów:', error);
    res.status(500).json({ message: 'Wystąpił problem z pobraniem obejrzanych utworów.' });
  }
};

// Oznaczanie utworu jako obejrzanego
const markAsWatched = async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user.watched.includes(movieId)) {
      user.watched.push(movieId);
      await user.save();
    }
    res.status(200).json({ message: 'Oznaczono jako obejrzany.' });
  } catch (error) {
    console.error('Błąd podczas oznaczania jako obejrzany:', error);
    res.status(500).json({ message: 'Wystąpił problem z oznaczaniem jako obejrzany.' });
  }
};

module.exports = {
  getUserRatings,
  rateMovie,
  getUserWatched,
  markAsWatched,
};
