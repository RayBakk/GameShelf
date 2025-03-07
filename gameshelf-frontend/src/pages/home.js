import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/modal';
import '../App.css';

const Home = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newGameName, setNewGameName] = useState('');
  const [newGamePlatform, setNewGamePlatform] = useState('Steam');
  const [isLoading, setIsLoading] = useState(false);

  const RAWG_API_KEY = '65ce24ced5b0462ea020544463fc5a9a';

  // Load cached games from local storage on initial render
  useEffect(() => {
    const cachedGames = JSON.parse(localStorage.getItem('games')) || [];
    setGames(cachedGames);
  }, []);

  // Save games to local storage whenever the games state changes
  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  const fetchGameImage = async (gameName) => {
    // Check if the game is already cached
    const cachedGame = games.find((game) => game.name === gameName);
    if (cachedGame) {
      return cachedGame.image; // Use cached image
    }

    // Fetch game image from RAWG.io API
    try {
      const response = await axios.get(
        `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${gameName}&page_size=1`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].background_image; // Get the first result's image
      }
    } catch (error) {
      console.error('Error fetching game image:', error);
    }
    return null; // Fallback if no image is found
  };

  const addGame = async () => {
    if (!newGameName) return; // Don't add a game without a name

    setIsLoading(true);

    const imageUrl = await fetchGameImage(newGameName);

    const newGame = {
      id: games.length + 1,
      name: newGameName,
      platform: newGamePlatform,
      status: 'Planning to Play',
      image: imageUrl || 'https://via.placeholder.com/200', // Fallback image
    };

    setGames([...games, newGame]);
    setNewGameName('');
    setNewGamePlatform('Steam');
    setIsLoading(false);
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleStatusChange = (id, newStatus) => {
    setGames(
      games.map((game) =>
        game.id === id ? { ...game, status: newStatus } : game
      )
    );
  };

  const handleNameChange = (id, newName) => {
    setGames(
      games.map((game) =>
        game.id === id ? { ...game, name: newName } : game
      )
    );
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

  return (
    <div>
      <div className="add-game-form">
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
        <button onClick={addGame} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add New Game'}
        </button>
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => handleGameClick(game)}
          >
            <img src={game.image} alt={game.name} />
            <h3>{game.name}</h3>
            <p>Platform: {game.platform}</p>
            <p>Status: {game.status}</p>
          </div>
        ))}
      </div>

      {selectedGame && (
        <Modal
          game={selectedGame}
          onClose={closeModal}
          onStatusChange={handleStatusChange}
          onNameChange={handleNameChange}
        />
      )}
    </div>
  );
};

export default Home;