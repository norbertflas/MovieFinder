// client/src/components/Results.js
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import ShowCard from './ShowCard';
import Loader from './Loader';

const Results = ({ recommendations }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      (recommendations.movies && recommendations.movies.length > 0) ||
      (recommendations.tvShows && recommendations.tvShows.length > 0)
    ) {
      setLoading(false);
    } else {
      setLoading(false); // Nawet jeśli brak wyników, przestajemy ładować
    }
  }, [recommendations]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="results-container p-6 mt-10 mb-20">
      {/* Rekomendacje Filmów */}
      {recommendations.movies && recommendations.movies.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
            Rekomendacje Filmów
          </h2>
          <div className="movies grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {/* Rekomendacje Seriali */}
      {recommendations.tvShows && recommendations.tvShows.length > 0 && (
        <>
          <h2 className="text-3xl font-bold my-6 text-center text-gray-800 dark:text-gray-200">
            Rekomendacje Seriali
          </h2>
          <div className="tvshows grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.tvShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </>
      )}

      {/* Brak rekomendacji */}
      {(!recommendations.movies || recommendations.movies.length === 0) &&
        (!recommendations.tvShows || recommendations.tvShows.length === 0) && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Brak wyników na podstawie wybranych kryteriów.
          </p>
        )}
    </div>
  );
};

export default Results;
