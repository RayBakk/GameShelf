import React from 'react';
import '../App.css';

const GameCard = ({ game, onClick, onDeleteGame }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteGame(game.id);
  };

  return (
    <div className="game-card" onClick={onClick}>
      <img src={game.image} alt={game.name} />
      <h3>{game.name}</h3>
      <p>Platform: {game.platform}</p>
      <p>Status: {game.status}</p>
      <button className="delete-button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default GameCard;