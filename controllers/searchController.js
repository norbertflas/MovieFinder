// server/controllers/searchController.js
const axios = require('axios');

const searchContent = async (req, res) => {
  const { query, type } = req.query; // type: 'movie' or 'series'

  try {
    let endpoint;
    if (type === 'movie') {
      endpoint = 'https://api.themoviedb.org/3/search/movie';
    } else if (type === 'series') {
      endpoint = 'https://api.themoviedb.org/3/search/tv';
    } else {
      return res.status(400).json({ message: 'Invalid search type.' });
    }

    const response = await axios.get(endpoint, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: query,
      },
    });

    const results = response.data.results;
    res.json({ results });
  } catch (error) {
    console.error('Search Error:', error.message);
    res.status(500).json({ message: 'Search failed. Try again later.' });
  }
};

module.exports = {
  searchContent,
};
