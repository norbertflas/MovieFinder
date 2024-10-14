const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Konfiguracja CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://tvfinder.netlify.app',
  credentials: true,
}));

// Middleware
app.use(express.json());

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Endpoint wyszukiwania
app.get('/api/search', (req, res) => {
  const { query, type } = req.query;
  // Tutaj dodaj logikę wyszukiwania
  res.json({ results: [`Result for ${query} as ${type}`] });
});

// Endpoint quizu
app.post('/api/quiz', (req, res) => {
  const answers = req.body.answers;
  // Tutaj dodaj logikę przetwarzania quizu
  res.json({ recommendations: ['Recommendation 1', 'Recommendation 2'] });
});

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
