require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();

// Konfiguracja CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://tvfinder.netlify.app',
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Trasy
const searchRoutes = require('./routes/search');
const recommendationsRoutes = require('./routes/recommendations');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');

app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
