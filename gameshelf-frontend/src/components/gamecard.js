import React, { useState } from 'react';

const GameCard = ({ game, onClick, onDeleteGame, onRateGame }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteGame(game._id);
  };

  const handleStarClick = (e, rating) => {
    e.stopPropagation();
    onRateGame(game._id, rating); 
  };

  return (
    <div className="game-card" onClick={onClick}>
      {game.coverImage && (
        <img 
          src={game.coverImage} 
          alt={game.title} 
          className="game-image"
          onError={(e) => {
            e.target.src = '/placeholder-game.png';
          }}
        />
      )}
      <div className="game-details">
        <h3>{game.title}</h3>
        <p>Platform: {game.platform}</p>
        <p>Status: {game.status}</p>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (hoverRating || game.rating) ? "filled" : ""}`}
              onClick={(e) => handleStarClick(e, star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default GameCard;