const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Przykładowa trasa dla rekomendacji
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Recommendations endpoint' });
});

module.exports = router;
