// server/routes/search.js
const express = require('express');
const router = express.Router();
const { searchMovies, searchSeries, searchActors, searchDirectors } = require('../controllers/searchController');

router.get('/search', async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type) {
    return res.status(400).json({ message: 'Brakuje wymaganego parametru: query lub type.' });
  }

  try {
    let results;
    switch (type) {
      case 'movie':
        results = await searchMovies(query);
        break;
      case 'series':
        results = await searchSeries(query);
        break;
      case 'actor':
        results = await searchActors(query);
        break;
      case 'director':
        results = await searchDirectors(query);
        break;
      default:
        return res.status(400).json({ message: 'Niepoprawny typ wyszukiwania.' });
    }

    res.json({ results });
  } catch (error) {
    console.error('Błąd w wyszukiwaniu:', error);
    res.status(500).json({ message: 'Wewnętrzny błąd serwera.' });
  }
});

module.exports = router;
