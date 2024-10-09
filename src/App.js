// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quiz from './components/Quiz';
import Results from './components/Results';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import axios from 'axios';

function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null); // Stan użytkownika

  useEffect(() => {
    // Sprawdzenie, czy użytkownik jest zalogowany
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user`, { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error('User not authenticated');
      }
    };
    fetchUser();
  }, []);

  const handleQuizComplete = (data) => {
    setRecommendations(data);
    setSearchResults(null);
  };

  const handleSearchComplete = (data) => {
    setSearchResults(data);
    setRecommendations(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'bg-base-200 text-base-content' : 'bg-base-100 text-base-content'}`}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} user={user} setUser={setUser} />
        <SearchBar onSearchComplete={handleSearchComplete} />
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={
              !recommendations && !searchResults ? (
                <Quiz onComplete={handleQuizComplete} />
              ) : (
                recommendations ? <Results recommendations={recommendations} /> : <Results recommendations={searchResults} />
              )
            } />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <footer className="py-4 text-center text-gray-600 dark:text-gray-400">
          © 2023 MovieFinder
        </footer>
      </div>
    </Router>
  );
}

export default App;
