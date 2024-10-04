// client/src/components/SearchBar.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearchComplete }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('movie'); // Przykładowy typ wyszukiwania
  const [loading, setLoading] = useState(false);

  // Utworzenie instancji axios z bazowym URL z zmiennej środowiskowej
  const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('Proszę wpisać zapytanie.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/api/search', {
        params: {
          query: query.trim(),
          type: searchType,
        },
      });
      setLoading(false);
      if (response.data.results && response.data.results.length > 0) {
        onSearchComplete(response.data.results);
      } else {
        alert('Nie znaleziono wyników.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during search:', error.response ? error.response.data : error.message);
      alert('Wystąpił problem podczas wyszukiwania. Spróbuj ponownie później.');
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center justify-center my-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj filmów lub seriali..."
        className="p-2 border border-gray-300 rounded-l-md focus:outline-none"
      />
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="p-2 border-t border-b border-gray-300 focus:outline-none"
      >
        <option value="movie">Film</option>
        <option value="series">Serial</option>
      </select>
      <button
        type="submit"
        className="p-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none"
        disabled={loading}
      >
        {loading ? 'Szukam...' : 'Szukaj'}
      </button>
    </form>
  );
};

export default SearchBar;
