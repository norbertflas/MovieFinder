// client/src/components/SearchBar.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('movie'); // movie, series, actor, director
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('Proszę wpisać zapytanie.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search`, {
        params: { query, type: searchType },
      });
      onSearch(response.data.results);
    } catch (err) {
      console.error('Błąd wyszukiwania:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Wyszukiwanie nie powiodło się.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="movie">Film</option>
        <option value="series">Serial</option>
        <option value="actor">Aktor</option>
        <option value="director">Reżyser</option>
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Wyszukaj..."
        className="p-2 border rounded flex-grow"
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Szukam...' : 'Szukaj'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default SearchBar;
