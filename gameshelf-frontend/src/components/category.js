import React from 'react';
import GameCard from './gamecard';

const Category = ({ title, games, onMarkAsCompleted }) => {
  return (
    <div className="category">
      <h2>{title}</h2>
      {games.map((game) => (
        <GameCard
          key={game._id}
          game={game}
          onMarkAsCompleted={onMarkAsCompleted}
        />
      ))}
    </div>
  );
};

export default Category;