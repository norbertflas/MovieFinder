// server/routes/user.js
const express = require('express');
const router = express.Router();
const { getUserRatings, rateMovie, getUserWatched, markAsWatched } = require('../controllers/userController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/ratings', authMiddleware, getUserRatings);
router.post('/rate', authMiddleware, rateMovie);
router.get('/watched', authMiddleware, getUserWatched);
router.post('/watched', authMiddleware, markAsWatched);

module.exports = router;
