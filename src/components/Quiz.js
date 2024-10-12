// client/src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const vodServices = [
  { value: 'netflix', label: 'Netflix' },
  { value: 'max', label: 'MAX' },
  { value: 'amazon', label: 'Amazon Prime Video' },
  { value: 'disney', label: 'Disney+' },
  { value: 'skyshowtime', label: 'Sky Showtime' },
  { value: 'appletv', label: 'Apple TV+' },
  { value: 'rakuten', label: 'Rakuten TV' },
  { value: 'via', label: 'ViaPlay' },
  // Dodaj inne serwisy VOD w Polsce...
];

const questions = [
  {
    id: 1,
    question: 'Wybierz preferowane gatunki (możesz wybrać kilka):',
    type: 'checkbox',
    options: [
      { value: '28', label: 'Akcja' },
      { value: '12', label: 'Przygodowy' },
      { value: '16', label: 'Animacja' },
      { value: '35', label: 'Komedia' },
      { value: '80', label: 'Kryminał' },
      { value: '99', label: 'Dokumentalny' },
      { value: '18', label: 'Dramat' },
      { value: '10751', label: 'Familijny' },
      { value: '14', label: 'Fantasy' },
      { value: '36', label: 'Historyczny' },
      { value: '27', label: 'Horror' },
      { value: '10402', label: 'Muzyczny' },
      { value: '9648', label: 'Tajemnica' },
      { value: '10749', label: 'Romans' },
      { value: '878', label: 'Science Fiction' },
      { value: '10770', label: 'Film TV' },
      { value: '53', label: 'Thriller' },
      { value: '10752', label: 'Wojenny' },
      { value: '37', label: 'Western' },
    ],
    required: true,
  },
  {
    id: 2,
    question: 'Wybierz dostępne serwisy VOD:',
    type: 'checkbox',
    options: vodServices,
    required: true,
  },
  {
    id: 3,
    question: 'Podaj zakres dat premiery (opcjonalne):',
    type: 'date-range',
    required: false,
  },
  // Dodaj więcej pytań...
];

const Quiz = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inicjalizacja odpowiedzi dla pytań typu checkbox
    const initialAnswers = questions.reduce((acc, question) => {
      if (question.type === 'checkbox') {
        acc[question.id] = [];
      }
      return acc;
    }, {});
    setAnswers(initialAnswers);
  }, []);

  const handleCheckboxChange = (questionId, optionValue) => {
    setAnswers(prevAnswers => {
      const currentValues = prevAnswers[questionId] || [];
      if (currentValues.includes(optionValue)) {
        return {
          ...prevAnswers,
          [questionId]: currentValues.filter((v) => v !== optionValue),
        };
      } else {
        return {
          ...prevAnswers,
          [questionId]: [...currentValues, optionValue],
        };
      }
    });
  };

  const handleDateRangeChange = (questionId, field, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [field]: value,
      },
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (currentQuestion.required && !isAnswerValid(currentQuestion.id)) {
      setError('To pytanie jest wymagane.');
      return;
    }
    setError(null);
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    setError(null);
  };

  const isAnswerValid = (questionId) => {
    const answer = answers[questionId];
    if (currentQuestion.type === 'checkbox') {
      return answer && answer.length > 0;
    }
    if (currentQuestion.type === 'date-range') {
      return answer && answer.from && answer.to;
    }
    return !!answer;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentQuestion.required && !isAnswerValid(currentQuestion.id)) {
      setError('To pytanie jest wymagane.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/quiz`,
        { answers },
        { withCredentials: true }
      );
      // Filtruj rekomendacje na podstawie wybranych serwisów VOD
      const filteredRecommendations = response.data.recommendations.filter(item =>
        item.vodServices.some(service => answers[2].includes(service))
      );
      onComplete(filteredRecommendations);
    } catch (error) {
      console.error('Błąd podczas przetwarzania quizu:', error);
      setError('Wystąpił błąd podczas przetwarzania quizu. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
      {currentQuestion.type === 'checkbox' && (
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option.value}
                checked={(answers[currentQuestion.id] || []).includes(option.value)}
                onChange={() => handleCheckboxChange(currentQuestion.id, option.value)}
                className="form-checkbox"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
      {currentQuestion.type === 'date-range' && (
        <div className="flex space-x-4">
          <label className="flex flex-col">
            <span>Data od:</span>
            <input
              type="date"
              onChange={(e) =>
                handleDateRangeChange(currentQuestion.id, 'from', e.target.value)
              }
              className="form-input mt-1"
            />
          </label>
          <label className="flex flex-col">
            <span>Data do:</span>
            <input
              type="date"
              onChange={(e) =>
                handleDateRangeChange(currentQuestion.id, 'to', e.target.value)
              }
              className="form-input mt-1"
            />
          </label>
        </div>
      )}
      {!currentQuestion.required && (
        <p className="text-gray-500 italic mt-2">To pytanie jest opcjonalne. Możesz je pominąć.</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-6 flex justify-between">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePrevious} className="btn btn-secondary">
            Wstecz
          </button>
        )}
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Przetwarzanie...' : 'Zakończ'}
          </button>
        ) : (
          <button onClick={handleNext} className="btn btn-primary">
            Dalej
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
