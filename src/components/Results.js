// client/src/components/Results.js
import React from 'react';
import { motion } from 'framer-motion';

const Results = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">No Recommendations Found</h2>
        <p>Try adjusting your preferences or selecting different services.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <motion.div
            key={item.id}
            className="card bg-base-200 shadow-lg rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            {item.poster_path ? (
              <figure>
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="w-full h-64 object-cover" />
              </figure>
            ) : (
              <figure className="h-64 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No Poster Available</span>
              </figure>
            )}
            <div className="card-body">
              <h3 className="card-title">{item.title || item.name}</h3>
              <p>{item.overview || 'No description available.'}</p>
              <a href={`https://www.themoviedb.org/${item.media_type || 'movie'}/${item.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">
                View Details
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Results;
