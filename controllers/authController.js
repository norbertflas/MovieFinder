const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Sprawdzenie, czy użytkownik już istnieje
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Haszowanie hasła
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tworzenie nowego użytkownika
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Tworzenie tokenu JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true });
        res.json({ token, user });
      }
    );
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).send('Server error');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sprawdzenie, czy użytkownik istnieje
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Sprawdzenie hasła
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Tworzenie tokenu JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true });
        res.json({ token, user });
      }
    );
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).send('Server error');
  }
};

const getUser = async (req, res) => {
  try {
    // Zakładam, że middleware authMiddleware ustawia req.user
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get User Error:', error.message);
    res.status(500).send('Server error');
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
};
