// client/src/components/Quiz.js
import React, { useState } from 'react';
import Button from './ui/Button';
import Select from './ui/Select';
import axios from 'axios';

const Quiz = ({ onComplete }) => {
  const initialAnswers = {
    vodServices: [],
    genres: [],
    type: '',
    duration: '',
    seasonRange: '',
    episodeLength: '',
    productionYearFrom: '',
    productionYearTo: '',
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [loading, setLoading] = useState(false);

  const vodOptions = [
    'Netflix',
    'HBO Max',
    'Disney+',
    'Amazon Prime Video',
    'Hulu',
    'Paramount+',
    // Dodaj inne serwisy w razie potrzeby
  ];

  const genreOptions = [
    'Komedia',
    'Akcja',
    'Romantyczna Komedia',
    'Dramat',
    'Sci-Fi',
    'Horror',
    'Thriller',
    'Dokumentalne',
    'Animacja',
    'Fantasy',
    'Romantyczny',
  ];

  const seasonOptions = [
    '1-4',
    '5-8',
    '9-12',
    '13-16',
    'Powyżej 16',
  ];

  const durationOptions = [
    '1-2 godziny',
    '2-3 godziny',
    'Powyżej 3 godzin',
  ];

  const episodeLengthOptions = [
    '< 30 minut',
    '30-60 minut',
    '> 60 minut',
  ];

  const questions = [
    {
      id: 'vodServices',
      question: 'Wybierz serwisy VOD, z których korzystasz:',
      type: 'multiselect',
      options: vodOptions,
      info: 'Jeśli nie korzystasz z żadnego serwisu, możesz przejść dalej.',
    },
    {
      id: 'genres',
      question: 'Wybierz gatunki, które preferujesz:',
      type: 'multiselect',
      options: genreOptions,
      info: 'Jeśli nie wiesz co chcesz oglądać i jesteś otwarty/a na wszystkie gatunki, przejdź dalej.',
    },
    {
      id: 'type',
      question: 'Typ rekomendacji:',
      type: 'radio',
      options: ['Film', 'Serial', 'Oba'],
    },
    {
      id: 'productionYearFrom',
      question: 'Podaj przedział roku produkcji (Od):',
      type: 'number',
      condition: () => true,
    },
    {
      id: 'productionYearTo',
      question: 'Podaj przedział roku produkcji (Do):',
      type: 'number',
      condition: () => true,
    },
    {
      id: 'duration',
      question: 'Jaki czas trwania preferujesz?',
      type: 'select',
      options: durationOptions,
      condition: (answers) => answers.type === 'Film' || answers.type === 'Oba',
    },
    {
      id: 'seasonRange',
      question: 'Jeśli wybrałeś Serial, jaki zakres liczby sezonów preferujesz?',
      type: 'select',
      options: seasonOptions,
      condition: (answers) => answers.type === 'Serial' || answers.type === 'Oba',
    },
    {
      id: 'episodeLength',
      question: 'Jaka jest preferowana długość odcinka serialu?',
      type: 'select',
      options: episodeLengthOptions,
      condition: (answers) => answers.type === 'Serial' || answers.type === 'Oba',
    },
  ];

  const handleChange = (e) => {
    const { name, value, options, type } = e.target;

    if (type === 'select-multiple') {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setAnswers((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateAnswers = () => {
    const currentQ = questions[currentQuestion];
    if (!currentQ.condition || currentQ.condition(answers)) {
      if (
        (currentQ.type === 'multiselect' && answers[currentQ.id].length === 0) ||
        (currentQ.type !== 'multiselect' && answers[currentQ.id] === '')
      ) {
        alert('Proszę udzielić odpowiedzi.');
        return false;
      }
    }
    return true;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateAnswers()) return;

    if (currentQuestion < questions.length - 1) {
      let nextQuestion = currentQuestion + 1;
      while (
        nextQuestion < questions.length &&
        questions[nextQuestion].condition &&
        !questions[nextQuestion].condition(answers)
      ) {
        nextQuestion += 1;
      }
      setCurrentQuestion(nextQuestion);
    } else {
      // Finalizacja quizu
      setLoading(true);
      const selectedType = answers.type; // 'Film', 'Serial', 'Oba'
      let recommendationType = 'both';
      if (selectedType === 'Film') {
        recommendationType = 'movies';
      } else if (selectedType === 'Serial') {
        recommendationType = 'tv';
      }

      try {
        const response = await axios.post(`/recommendations`, {
          services: answers.vodServices,
          answers,
          type: recommendationType,
        });
        setLoading(false);
        onComplete(response.data);
      } catch (error) {
        setLoading(false);
        console.error(
          'Error fetching recommendations:',
          error.response ? error.response.data : error.message
        );
        alert('Wystąpił problem z pobraniem rekomendacji. Spróbuj ponownie później.');
      }
    }
  };

  const currentQ = questions[currentQuestion];

  if (!currentQ) {
    return null;
  }

  return (
    <div className="quiz-container p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        Quiz
      </h2>
      <form onSubmit={handleNext} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {currentQ.question}
          </label>
          {currentQ.type === 'multiselect' && (
            <Select
              name={currentQ.id}
              multiple
              value={answers[currentQ.id]}
              onChange={handleChange}
              className="mt-1 block w-full"
            >
              {currentQ.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          )}
          {currentQ.type === 'select' && (
            <Select
              name={currentQ.id}
              value={answers[currentQ.id]}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
            >
              <option value="">Wybierz opcję</option>
              {currentQ.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          )}
          {currentQ.type === 'radio' && (
            <div className="mt-2 space-y-2">
              {currentQ.options.map((option) => (
                <label key={option} className="inline-flex items-center text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name={currentQ.id}
                    value={option}
                    checked={answers[currentQ.id] === option}
                    onChange={handleChange}
                    required
                    className="form-radio h-4 w-4 text-purple-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          )}
          {currentQ.type === 'number' && (
            <input
              type="number"
              name={currentQ.id}
              value={answers[currentQ.id]}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          )}
        </div>
        {currentQ.info && (
          <p className="text-sm text-gray-500 italic">{currentQ.info}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? 'Ładowanie...'
            : currentQuestion === questions.length - 1
            ? 'Zakończ Quiz'
            : 'Następny'}
        </Button>
      </form>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
        Pytanie {currentQuestion + 1} z {questions.length}
      </div>
    </div>
  );
};

export default Quiz;
