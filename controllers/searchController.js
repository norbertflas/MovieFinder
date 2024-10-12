// server/controllers/searchController.js
const axios = require('axios');
const Movie = require('../models/Movie');
const Series = require('../models/Series');
const Actor = require('../models/Actor');
const Director = require('../models/Director');
const asyncHandler = require('express-async-handler');

const cache = {};

const searchItem = asyncHandler(async (req, res) => {
  const { query, type, page = 1, language = 'pl-PL' } = req.query;

  if (!query || !type) {
    return res.status(400).json({ message: 'Both query and type are required.' });
  }

  const validTypes = ['movie', 'series', 'actor', 'director'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid search type.' });
  }

  const cacheKey = `${type}-${query}-${page}-${language}`;
  if (cache[cacheKey]) {
    return res.json({ results: cache[cacheKey] });
  }

  let endpoint;
  if (type === 'actor' || type === 'director') {
    endpoint = 'person';
  } else if (type === 'movie') {
    endpoint = 'movie';
  } else if (type === 'series') {
    endpoint = 'tv';
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/${endpoint}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: query,
        page: page,
        language: language,
      },
    });

    const results = response.data.results;
    cache[cacheKey] = results;

    res.json({ results });
  } catch (error) {
    console.error('Search Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Search failed. Try again later.' });
  }
});

// Przykładowe funkcje wyszukiwania
const searchMovies = async (query) => {
  return await Movie.find({ title: { $regex: query, $options: 'i' } });
};

const searchSeries = async (query) => {
  return await Series.find({ title: { $regex: query, $options: 'i' } });
};

const searchActors = async (query) => {
  return await Actor.find({ name: { $regex: query, $options: 'i' } });
};

const searchDirectors = async (query) => {
  return await Director.find({ name: { $regex: query, $options: 'i' } });
};

module.exports = {
  searchItem,
  searchMovies,
  searchSeries,
  searchActors,
  searchDirectors,
};
