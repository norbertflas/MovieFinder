// client/src/components/App.js
import { useState, useEffect } from 'react';
import Quiz from './Quiz';
import Results from './Results';
import SearchBar from './SearchBar'; // Poprawna ścieżka
import { Sun, Moon } from 'lucide-react';

function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Ustawienie klasy 'dark' na elemencie html
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleQuizComplete = (data) => {
    setRecommendations(data);
    setSearchResults(null); // Reset wyników wyszukiwania
  };

  const handleSearchComplete = (data) => {
    setSearchResults(data);
    setRecommendations(null); // Reset rekomendacji z quizu
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <header className="py-6 bg-purple-600 text-white flex justify-between items-center px-6">
        <h1 className="text-3xl font-bold">Rekomendator Filmów i Seriali</h1>
        <button onClick={toggleDarkMode} className="focus:outline-none">
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </header>
      <SearchBar onSearchComplete={handleSearchComplete} /> {/* Dodana wyszukiwarka */}
      <main className="container mx-auto px-4">
        {!recommendations && !searchResults && (
          <Quiz onComplete={handleQuizComplete} />
        )}
        {recommendations && <Results recommendations={recommendations} />}
        {searchResults && <Results recommendations={searchResults} />}
      </main>
      <footer className="py-4 text-center text-gray-600 dark:text-gray-400">
        © 2024 Rekomendator Filmów i Seriali
      </footer>
    </div>
  );
}

export default App;
