import React from 'react';
import '../App.css';

const GameCard = ({ game, onClick, onDeleteGame, onRateGame }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteGame(game.id);
  };

  const handleStarClick = (e, rating) => {
    e.stopPropagation();
    onRateGame(game.id, rating);
  };

  return (
    <div className="game-card" onClick={onClick}>
      <img src={game.image} alt={game.name} />
      <h3>{game.name}</h3>
      <p>Platform: {game.platform}</p>
      <p>Status: {game.status}</p>
      <p>Rating: 
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= game.rating ? "filled" : ""}`}
            onClick={(e) => handleStarClick(e, star)}
          >
            ★
          </span>
        ))}
      </div>
      </p>
      <button className="delete-button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default GameCard;
