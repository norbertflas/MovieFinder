// client/src/components/Quiz.js
import React, { useState } from 'react';
import Button from './ui/Button';
import axios from 'axios';

const Quiz = ({ onComplete }) => {
  const [answers, setAnswers] = useState({
    favoriteGenre: '',
    selectedServices: []
  });
  const [loading, setLoading] = useState(false);

  const handleGenreChange = (e) => {
    setAnswers({ ...answers, favoriteGenre: e.target.value });
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAnswers(prev => ({ ...prev, selectedServices: [...prev.selectedServices, value] }));
    } else {
      setAnswers(prev => ({ ...prev, selectedServices: prev.selectedServices.filter(service => service !== value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.selectedServices.length === 0) {
      alert('Proszę wybrać co najmniej jeden serwis VOD.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/quiz`, { answers }, { withCredentials: true });
      setLoading(false);
      onComplete(response.data.recommendations);
    } catch (error) {
      setLoading(false);
      console.error('Quiz submission error:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : 'Quiz submission failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Movie Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Favorite Genre */}
        <div>
          <label className="label">
            <span className="label-text">Favorite Genre</span>
          </label>
          <select
            name="favoriteGenre"
            value={answers.favoriteGenre}
            onChange={handleGenreChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select Genre</option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="80">Crime</option>
            <option value="99">Documentary</option>
            <option value="18">Drama</option>
            <option value="10751">Family</option>
            <option value="14">Fantasy</option>
            <option value="36">History</option>
            <option value="27">Horror</option>
            <option value="10402">Music</option>
            <option value="9648">Mystery</option>
            <option value="10749">Romance</option>
            <option value="878">Science Fiction</option>
            <option value="10770">TV Movie</option>
            <option value="53">Thriller</option>
            <option value="10752">War</option>
            <option value="37">Western</option>
          </select>
        </div>

        {/* Available on (VOD Services) */}
        <div>
          <label className="label">
            <span className="label-text">Available on:</span>
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                value="netflix"
                checked={answers.selectedServices.includes('netflix')}
                onChange={handleServiceChange}
                className="checkbox checkbox-primary"
              />
              <span className="ml-2">Netflix</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                value="hulu"
                checked={answers.selectedServices.includes('hulu')}
                onChange={handleServiceChange}
                className="checkbox checkbox-primary"
              />
              <span className="ml-2">Hulu</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                value="amazon_prime"
                checked={answers.selectedServices.includes('amazon_prime')}
                onChange={handleServiceChange}
                className="checkbox checkbox-primary"
              />
              <span className="ml-2">Amazon Prime</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                value="disney_plus"
                checked={answers.selectedServices.includes('disney_plus')}
                onChange={handleServiceChange}
                className="checkbox checkbox-primary"
              />
              <span className="ml-2">Disney+</span>
            </label>
            {/* Dodaj więcej serwisów według potrzeb */}
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Quiz'}
        </Button>
      </form>
    </div>
  );
};

export default Quiz;
