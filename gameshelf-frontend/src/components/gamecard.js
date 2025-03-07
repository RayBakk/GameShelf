import React from 'react';
import '../App.css';

const GameCard = ({ game, onMarkAsCompleted }) => {
  return (
    <div className="game-card">
      <h3>{game.name}</h3>
      <p>Platform: {game.platform}</p>
      <p>Status: {game.status}</p>
      {game.status !== 'Completed' && (
        <button onClick={() => onMarkAsCompleted(game.id)}>
          Mark as Completed
        </button>
      )}
    </div>
  );
};

export default GameCard;