import React, { useState } from 'react';
import Button from './ui/Button';
import axios from 'axios';

const Quiz = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Question 1: Favorite Genre?</span>
          </label>
          <input
            type="text"
            name="question1"
            value={answers.question1 || ''}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        {/* Dodaj więcej pytań według potrzeb */}
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Quiz'}
        </Button>
      </form>
    </div>
  );
};

export default Quiz;
