const User = require('../models/User');

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Błąd podczas pobierania użytkownika:', error);
    res.status(500).json({ message: 'Wystąpił problem z pobraniem danych użytkownika.' });
  }
};

module.exports = { getUser };
