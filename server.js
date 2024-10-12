const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
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
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Przykładowe endpointy
app.get('/api/auth/user', (req, res) => {
  res.json({ user: 'Authenticated User' });
});

app.get('/api/search', (req, res) => {
  const query = req.query.query;
  const type = req.query.type;
  res.json({ results: [`Result for ${query} as ${type}`] });
});

app.post('/api/quiz', (req, res) => {
  const answers = req.body.answers;
  res.json({ recommendations: ['Recommendation 1', 'Recommendation 2'] });
});

app.use((req, res) => {
    res.status(404).send('Nie znaleziono zasobu');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
