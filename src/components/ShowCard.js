// client/src/components/ShowCard.js
import React from 'react';

const ShowCard = ({ show, isDarkMode }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      <img
        src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
        alt={show.name}
        className="w-full h-auto rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{show.name}</h3>
      <p className="text-sm mb-2">{show.overview}</p>
      <p className="text-sm font-medium">Ocena: {show.vote_average}</p>
    </div>
  );
};

export default ShowCard;
