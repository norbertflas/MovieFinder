// server/controllers/recommendationsController.js
const axios = require('axios');
const User = require('../models/User');

const getRecommendations = async (req, res) => {
  const { services, type, answers } = req.body;

  try {
    // Budowanie zapytania na podstawie preferencji użytkownika
    const serviceIds = services.map(service => process.env[`TMDB_PROVIDER_${service.toUpperCase().replace(' ', '_')}`]).join(',');
    const genreIds = answers.genres.map(genre => process.env[`TMDB_GENRE_${genre.toUpperCase().replace(' ', '_')}`]).join(',');
    const yearFrom = answers.productionYearFrom || '1900';
    const yearTo = answers.productionYearTo || new Date().getFullYear().toString();

    const tmdbUrl = `https://api.themoviedb.org/3/discover/${type}?api_key=${process.env.TMDB_API_KEY}&with_watch_providers=${serviceIds}&watch_region=PL&with_genres=${genreIds}&primary_release_date.gte=${yearFrom}-01-01&primary_release_date.lte=${yearTo}-12-31`;

    const response = await axios.get(tmdbUrl);
    const results = response.data.results;

    if (results.length === 0) {
      return res.status(200).json({ message: 'Brak wyników na podstawie wybranych kryteriów.' });
    }

    // Zapisanie preferencji użytkownika w bazie danych
    const user = await User.findById(req.user.id);
    if (user) {
      user.preferences = { services, type, answers };
      await user.save();
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Błąd podczas pobierania rekomendacji:', error.message);
    res.status(500).json({ message: 'Wystąpił problem z pobraniem rekomendacji. Spróbuj ponownie później.' });
  }
};

const generateRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.preferences) {
      return res.status(400).json({ message: 'Brak preferencji do generowania rekomendacji.' });
    }

    const { services, type, answers } = user.preferences;

    // Podobnie jak w getRecommendations
    const serviceIds = services.map(service => process.env[`TMDB_PROVIDER_${service.toUpperCase().replace(' ', '_')}`]).join(',');
    const genreIds = answers.genres.map(genre => process.env[`TMDB_GENRE_${genre.toUpperCase().replace(' ', '_')}`]).join(',');
    const yearFrom = answers.productionYearFrom || '1900';
    const yearTo = answers.productionYearTo || new Date().getFullYear().toString();

    const tmdbUrl = `https://api.themoviedb.org/3/discover/${type}?api_key=${process.env.TMDB_API_KEY}&with_watch_providers=${serviceIds}&watch_region=PL&with_genres=${genreIds}&primary_release_date.gte=${yearFrom}-01-01&primary_release_date.lte=${yearTo}-12-31`;

    const response = await axios.get(tmdbUrl);
    const results = response.data.results;

    if (results.length === 0) {
      return res.status(200).json({ message: 'Brak nowych wyników na podstawie preferencji.' });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Błąd podczas generowania rekomendacji:', error.message);
    res.status(500).json({ message: 'Wystąpił problem z generowaniem rekomendacji. Spróbuj ponownie później.' });
  }
};

module.exports = {
  getRecommendations,
  generateRecommendations,
};
