// client/src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { ThumbsUp, ThumbsDown, PlayCircle, Calendar, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserProfile = ({ user, setUser }) => {
  const [ratings, setRatings] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [loadingWatched, setLoadingWatched] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Pobierz oceny użytkownika
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/user/ratings', { withCredentials: true });
        setRatings(response.data.ratings);
        setLoadingRatings(false);
      } catch (error) {
        console.error('Błąd podczas pobierania ocen:', error);
        setLoadingRatings(false);
      }
    };

    // Pobierz obejrzane filmy/seriale
    const fetchWatched = async () => {
      try {
        const response = await axios.get('/api/user/watched', { withCredentials: true });
        setWatched(response.data.watched);
        setLoadingWatched(false);
      } catch (error) {
        console.error('Błąd podczas pobierania obejrzanych utworów:', error);
        setLoadingWatched(false);
      }
    };

    fetchRatings();
    fetchWatched();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
      alert('Wystąpił problem podczas wylogowywania. Spróbuj ponownie później.');
    }
  };

  const handleRate = async (movieId, currentRating) => {
    if (!user) {
      alert('Musisz być zalogowany, aby ocenić film.');
      return;
    }
    const newRating = currentRating === 1 ? 0 : 1; // Toggle rating
    try {
      await axios.post('/api/user/rate', { movieId, rating: newRating }, { withCredentials: true });
      setRatings((prev) =>
        prev.map((item) =>
          item.movieId === movieId ? { ...item, rating: newRating } : item
        )
      );
    } catch (error) {
      console.error('Błąd podczas oceny:', error);
      alert('Wystąpił problem podczas oceny. Spróbuj ponownie później.');
    }
  };

  const handleMarkAsWatched = async (movieId) => {
    if (!user) {
      alert('Musisz być zalogowany, aby oznaczyć film jako obejrzany.');
      return;
    }
    try {
      await axios.post('/api/user/watched', { movieId }, { withCredentials: true });
      setWatched((prev) => [...prev, movieId]);
    } catch (error) {
      console.error('Błąd podczas oznaczania filmu jako obejrzanego:', error);
      alert('Wystąpił problem podczas oznaczania. Spróbuj ponownie później.');
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!user) {
      alert('Musisz być zalogowany, aby generować nowe rekomendacje.');
      return;
    }
    setGenerating(true);
    try {
      const response = await axios.post('/api/recommendations/generate', {}, { withCredentials: true });
      alert('Nowe rekomendacje zostały wygenerowane!');
      setGenerating(false);
      window.location.reload(); // Przeładuj stronę, aby zobaczyć nowe rekomendacje
    } catch (error) {
      console.error('Błąd podczas generowania rekomendacji:', error);
      alert('Wystąpił problem podczas generowania rekomendacji. Spróbuj ponownie później.');
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Profil Użytkownika</h2>
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
          Wyloguj się
        </Button>
      </div>
      <p className="mb-6 text-gray-700 dark:text-gray-300">Email: {user.email}</p>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Twoje Oceny</h3>
          <Button onClick={handleGenerateRecommendations} disabled={generating} className="flex items-center bg-green-500 hover:bg-green-600">
            {generating && <RefreshCw className="animate-spin mr-2" />}
            Generuj Nowe Rekomendacje
          </Button>
        </div>
        {loadingRatings ? (
          <p className="text-gray-600 dark:text-gray-300">Ładowanie ocen...</p>
        ) : ratings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ratings.map((item) => (
              <motion.div
                key={item.movieId}
                className={`p-4 rounded-lg shadow ${item.rating === 1 ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h4 className="text-lg font-semibold mb-2">Film ID: {item.movieId}</h4>
                <p className="mb-4">Ocena: {item.rating === 1 ? 'Lubię to' : 'Nie lubię tego'}</p>
                <Button onClick={() => handleRate(item.movieId, item.rating)} className="flex items-center bg-blue-500 hover:bg-blue-600">
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  {item.rating === 1 ? 'Anuluj Lubię to' : 'Lubię to'}
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Nie oceniałeś jeszcze żadnych filmów.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Twoje Obejrzane</h3>
        {loadingWatched ? (
          <p className="text-gray-600 dark:text-gray-300">Ładowanie obejrzanych utworów...</p>
        ) : watched.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {watched.map((movieId) => (
              <motion.div
                key={movieId}
                className="p-4 rounded-lg shadow bg-blue-100 dark:bg-blue-800"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h4 className="text-lg font-semibold mb-2">Film ID: {movieId}</h4>
                <Button onClick={() => handleMarkAsWatched(movieId)} className="flex items-center bg-yellow-500 hover:bg-yellow-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  Oznacz jako Obejrzany
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Nie oznaczyłeś jeszcze żadnych filmów jako obejrzanych.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
