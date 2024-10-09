// server/routes/recommendations.js
const express = require('express');
const router = express.Router();
const { getRecommendations, generateRecommendations } = require('../controllers/recommendationsController');
const authMiddleware = require('../middleware/authMiddleware');

// Przykładowa trasa dla rekomendacji
router.post('/', authMiddleware, getRecommendations);

// Trasa do generowania rekomendacji na podstawie zapisanych preferencji
router.get('/generate', authMiddleware, generateRecommendations);

module.exports = router;
