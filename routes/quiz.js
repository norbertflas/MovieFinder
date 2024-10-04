const express = require('express');
const router = express.Router();
const { processQuiz } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, processQuiz);

module.exports = router;
