const express = require('express');
const router = express.Router();
const { searchPerson } = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, searchPerson);

module.exports = router;
