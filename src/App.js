// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Quiz from './components/Quiz';
import Results from './components/Results';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import { Sun, Moon } from 'lucide-react';
import axios from 'axios';

// Utworzenie instancji axios z bazowym URL z zmiennej środowiskowej
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null); // Nowy stan dla użytkownika

  useEffect(() => {
    // Sprawdź, czy użytkownik jest zalogowany
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/user');
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
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <header className="py-6 bg-purple-600 text-white flex justify-between items-center px-6">
          <Link to="/">
            <h1 className="text-3xl font-bold">Rekomendator Filmów i Seriali</h1>
          </Link>
          <div className="flex items-center">
            <button onClick={toggleDarkMode} className="focus:outline-none mr-4">
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            {user ? (
              <UserProfile user={user} setUser={setUser} />
            ) : (
              <div>
                <Link to="/login" className="mr-4">Zaloguj się</Link>
                <Link to="/register">Zarejestruj się</Link>
              </div>
            )}
          </div>
        </header>
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
          © 2023 Rekomendator Filmów i Seriali
        </footer>
      </div>
    </Router>
  );
}

export default App;
