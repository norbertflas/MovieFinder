const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUser } = require('../controllers/authController');

router.get('/', authMiddleware, getUser);

module.exports = router;
