const axios = require('axios');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const processQuiz = async (req, res) => {
  const { answers } = req.body;

  try {
    const genreIds = answers['1']; // Zakładając, że pytanie o gatunki ma ID 1
    const dateRange = answers['2']; // Zakładając, że pytanie o daty ma ID 2

    let params = {
      api_key: process.env.TMDB_API_KEY,
      language: 'pl-PL',
      with_genres: genreIds ? genreIds.join(',') : undefined,
      'primary_release_date.gte': dateRange?.from,
      'primary_release_date.lte': dateRange?.to,
    };

    // Usuń nieokreślone parametry
    params = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    );

    const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
      params,
    });

    const recommendations = response.data.results;

    res.json({ recommendations });
  } catch (error) {
    console.error('Quiz Processing Error:', error.message);
    res.status(500).json({ message: 'Quiz processing failed. Try again later.' });
  }
};

module.exports = {
  processQuiz,
};
