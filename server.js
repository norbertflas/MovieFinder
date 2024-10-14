const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Importowanie plików routingu
const app = express();

// Konfiguracja CORS
const allowedOrigin = process.env.CORS_ORIGIN || 'https://tvfinder.netlify.app';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Połączenie z MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviefinder';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Użycie plików routingu
app.use('/api/auth', authRoutes);

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
