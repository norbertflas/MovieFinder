// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const recommendationsRoutes = require('./routes/recommendations');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Połączono z MongoDB');
}).catch((err) => {
  console.error('Błąd połączenia z MongoDB:', err);
});

// Middleware
app.use(cors({
  origin: 'https://tvfinder.netlify.app',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Trasy
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/user', userRoutes);

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
