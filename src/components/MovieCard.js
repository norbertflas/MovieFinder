// client/src/components/MovieCard.js
import React, { useState } from 'react';
import { PlayCircle, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from './ui/Button';

const MovieCard = ({ movie, user, isDarkMode }) => {
  const [rating, setRating] = useState(movie.rating || 0);

  const handleRate = async (ratingValue) => {
    if (!user) {
      alert('Musisz być zalogowany, aby ocenić film.');
      return;
    }
    try {
      await axios.post('/api/user/rate', { movieId: movie.id, rating: ratingValue }, { withCredentials: true });
      setRating(ratingValue);
    } catch (error) {
      console.error('Błąd podczas oceniania:', error);
      alert('Wystąpił problem podczas oceniania. Spróbuj ponownie później.');
    }
  };

  const handleMarkAsWatched = async () => {
    if (!user) {
      alert('Musisz być zalogowany, aby oznaczyć film jako obejrzany.');
      return;
    }
    try {
      await axios.post('/api/user/watched', { movieId: movie.id }, { withCredentials: true });
      alert('Film oznaczony jako obejrzany.');
    } catch (error) {
      console.error('Błąd podczas oznaczania filmu jako obejrzanego:', error);
      alert('Wystąpił problem podczas oznaczania. Spróbuj ponownie później.');
    }
  };

  const ratingEmoji = () => {
    if (rating >= 4.5) return "😍";
    if (rating >= 4) return "😊";
    if (rating >= 3) return "😐";
    return "😕";
  };

  return (
    <motion.div 
      className={`flex items-start space-x-4 p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-75'} backdrop-blur-md`}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div className="relative">
        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="rounded-md object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
          <PlayCircle className="w-10 h-10 text-white" />
        </div>
      </motion.div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{movie.overview}</p>
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
            Dostępne na: {movie.platform}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleRate(1)} className={`flex items-center ${rating === 1 ? 'bg-green-500' : 'bg-blue-500'} hover:bg-blue-600`}>
            <ThumbsUp className="w-5 h-5 mr-2" />
            {rating === 1 ? 'Anuluj Lubię to' : 'Lubię to'}
          </Button>
          <Button onClick={() => handleRate(0)} className={`flex items-center ${rating === 0 ? 'bg-red-500' : 'bg-yellow-500'} hover:bg-red-600`}>
            <ThumbsDown className="w-5 h-5 mr-2" />
            {rating === 0 ? 'Anuluj Nie Lubię' : 'Nie Lubię'}
          </Button>
          <Button onClick={handleMarkAsWatched} className="flex items-center bg-purple-500 hover:bg-purple-600">
            <Calendar className="w-5 h-5 mr-2" />
            Oznacz jako Obejrzany
          </Button>
        </div>
        <div className="mt-2">
          <span className="text-2xl mr-2">{ratingEmoji()}</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            className="w-24"
            disabled
          />
          <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
