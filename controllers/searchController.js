const axios = require('axios');

const searchPerson = async (req, res) => {
  const { query, type } = req.query; // type: 'actor' or 'director'

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/person`, {
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
  searchPerson,
};
