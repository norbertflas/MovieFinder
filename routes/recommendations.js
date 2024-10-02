// server/routes/recommendations.js
const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  generateRecommendations,
} = require('../controllers/recommendationsController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, getRecommendations);
router.post('/generate', authMiddleware, generateRecommendations);

module.exports = router;
