// server/controllers/quizController.js
const { getRecommendationsInternal } = require('./recommendationsController');

const processQuiz = async (req, res) => {
  const { answers } = req.body;

  try {
    const services = answers.selectedServices; // ['netflix', 'hulu']
    const favoriteGenre = answers.favoriteGenre; // genre ID
    const type = 'movie'; // Możesz dostosować, aby użytkownik mógł wybrać 'movie' lub 'tv'

    // Przygotowanie odpowiedzi quizu do logiki rekomendacji
    const quizAnswers = {
      genres: [favoriteGenre],
      // Możesz dodać więcej pól, jeśli masz więcej pytań
    };

    // Pobranie rekomendacji na podstawie odpowiedzi quizu
    const recommendations = await getRecommendationsInternal(services, type, quizAnswers);

    res.json({ recommendations });
  } catch (error) {
    console.error('Quiz Processing Error:', error.message);
    res.status(500).json({ message: 'Quiz processing failed. Try again later.' });
  }
};

module.exports = {
  processQuiz,
};
