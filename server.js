// server/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const recommendationsRoutes = require('./routes/recommendations');
const searchRoutes = require('./routes/search');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');
require('dotenv').config(); // Upewnij się, że zmienne środowiskowe są załadowane

const app = express();
const PORT = process.env.PORT || 5000;

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Konfiguracja CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://tvfinder.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Trasy
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);

// Obsługa błędów 404
app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
