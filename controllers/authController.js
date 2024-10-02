// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sprawdzenie, czy użytkownik już istnieje
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Użytkownik już istnieje.' });
    }

    // Tworzenie nowego użytkownika
    user = new User({
      email,
      password,
    });

    // Hashowanie hasła
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie.' });
  } catch (error) {
    console.error('Błąd podczas rejestracji:', error);
    res.status(500).json({ message: 'Wystąpił problem podczas rejestracji.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sprawdzenie, czy użytkownik istnieje
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło.' });
    }

    // Sprawdzenie hasła
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło.' });
    }

    // Tworzenie tokenu JWT
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Ustawienie tokenu jako ciasteczko
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Użyj secure w produkcji
      sameSite: 'strict',
      maxAge: 3600000, // 1 godzina
    });

    res.status(200).json({ message: 'Zalogowano pomyślnie.', user: payload });
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    res.status(500).json({ message: 'Wystąpił problem podczas logowania.' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    console.error('Błąd podczas pobierania użytkownika:', error);
    res.status(500).json({ message: 'Wystąpił problem z pobraniem użytkownika.' });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Wylogowano pomyślnie.' });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
};
