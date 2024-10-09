// server/routes/search.js
const express = require('express');
const router = express.Router();
const { searchContent } = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, searchContent);

module.exports = router;
