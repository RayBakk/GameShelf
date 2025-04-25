import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import GameCard from '../components/gamecard';
import Modal from '../components/modal';
import '../App.css';

const Home = ({ games, setGames }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newGameName, setNewGameName] = useState('');
  const [newGamePlatform, setNewGamePlatform] = useState('Steam');
  const [newGameStatus, setNewGameStatus] = useState('Planning To Play');
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('games')) || [];
    setGames(savedGames);
  }, [setGames]);

  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  const fetchGameImage = async (gameName) => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=65ce24ced5b0462ea020544463fc5a9a&search=${gameName}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].background_image;
      }
    } catch (error) {
      console.error('Error fetching game image:', error);
      return '/gameshelf-frontend/src/images/placeholder.jpg';
    }
  };

  const addGame = async () => {
    if (!newGameName.trim()) {
      alert('Please enter a game name.');
      return;
    }

    

    setIsLoading(true);

    const imageUrl = await fetchGameImage(newGameName);

    const newGame = {
      id: uuidv4(),
      name: newGameName,
      platform: newGamePlatform,
      status: newGameStatus,
      image: imageUrl,
    };

    setGames([...games, newGame]);
    setNewGameName('');
    setNewGamePlatform('Steam');
    setNewGameStatus('Planning To Play');
    setIsLoading(false);
    setShowForm(false);
  };

  const editGame = (id, updatedGame) => {
    const updatedGames = games.map((game) =>
      game.id === id ? { ...game, ...updatedGame } : game
    );
    setGames(updatedGames);
  };

  const deleteGame = (id) => {
    const updatedGames = games.filter((game) => game.id !== id);
    setGames(updatedGames);
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState('');

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredAndSortedGames = games
  .filter((game) => {
    return game.name.toLowerCase().includes(searchTerm.toLowerCase());
  })
  .filter((game) => {
    if (sortBy === "") return true;
    return game.status === sortBy;
  });

  const updateGameRating = (id, rating) => {
    const updatedGames = games.map((game) =>
      game.id === id ? { ...game, rating } : game
    );
    setGames(updatedGames);
  };
  
  return (
    <div className="home">
      <h1 className="list-title">Game List</h1>
      <input
      className="searchbar"
      type="text"
      placeholder="Search games..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setShowForm(true)}>Add Game</button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Game</h3>
            <input
              type="text"
              placeholder="Game Name"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
            />
            <select
              value={newGamePlatform}
              onChange={(e) => setNewGamePlatform(e.target.value)}
            >
              <option value="Steam">Steam</option>
              <option value="Epic Games">Epic Games</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={newGameStatus}
              onChange={(e) => setNewGameStatus(e.target.value)}
            >
              <option value="Planning To Play">Planning To Play</option>
              <option value="Playing">Playing</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={addGame} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Game'}
            </button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <select className='custom-dropdown' onChange={handleSortChange} value={sortBy}>
        <option value="">Sort by Status</option>
        <option value="Planning To Play">Planning To Play</option>
        <option value="Playing">Playing</option>
        <option value="Completed">Completed</option>
      </select>

      <div className="game-grid">
        {filteredAndSortedGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => handleGameClick(game)}
            onDeleteGame={deleteGame}
            onRateGame={updateGameRating}
          />
        ))}
      </div>

      {selectedGame && (
        <Modal
          game={selectedGame}
          onClose={handleCloseModal}
          onSave={(updatedGame) => {
            editGame(selectedGame.id, updatedGame);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

export default Home;