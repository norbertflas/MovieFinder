import React from 'react';

const Results = ({ recommendations }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <div key={item.id} className="card bg-base-200 shadow-lg">
            {item.poster_path ? (
              <figure>
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} />
              </figure>
            ) : (
              <figure className="h-64 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No Poster Available</span>
              </figure>
            )}
            <div className="card-body">
              <h3 className="card-title">{item.title || item.name}</h3>
              <p>{item.overview || 'No description available.'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
