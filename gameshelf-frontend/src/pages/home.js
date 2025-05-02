import React, { useState, useEffect } from 'react';
import GameCard from '../components/gamecard';
import Modal from '../components/modal';
import '../App.css';

const Home = () => {
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGamePlatform, setNewGamePlatform] = useState('Steam');
  const [newGameCompleted, setNewGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/games', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setGames(data);
    };

    fetchGames();
  }, []);

  const addGame = async () => {
    if (!newGameTitle.trim()) {
      alert('Please enter a game name.');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');

    const res = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newGameTitle,
        platform: newGamePlatform,
        completed: newGameCompleted
      })
    });

    const newGame = await res.json();
    setGames([...games, newGame]);

    setNewGameTitle('');
    setNewGamePlatform('Steam');
    setNewGameCompleted(false);
    setIsLoading(false);
    setShowForm(false);
  };

  const deleteGame = (id) => {
    const updatedGames = games.filter((game) => game._id !== id);
    setGames(updatedGames);
  };

  const editGame = (id, updatedFields) => {
    const updatedGames = games.map((game) =>
      game._id === id ? { ...game, ...updatedFields } : game
    );
    setGames(updatedGames);
  };

  const updateGameRating = (id, rating) => {
    const updatedGames = games.map((game) =>
      game._id === id ? { ...game, rating } : game
    );
    setGames(updatedGames);
  };

  const filteredAndSortedGames = games
    .filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((game) => {
      if (sortBy === '') return true;
      return sortBy === 'Completed' ? game.completed : !game.completed;
    });

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
              value={newGameTitle}
              onChange={(e) => setNewGameTitle(e.target.value)}
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
              value={newGameCompleted}
              onChange={(e) => setNewGameCompleted(e.target.value === 'true')}
            >
              <option value={false}>Not Completed</option>
              <option value={true}>Completed</option>
            </select>
            <button onClick={addGame} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Game'}
            </button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <select className="custom-dropdown" onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
        <option value="">Sort by Status</option>
        <option value="Playing">Playing</option>
        <option value="Completed">Completed</option>
      </select>

      <div className="game-grid">
        {filteredAndSortedGames.map((game) => (
          <GameCard
            key={game._id}
            game={game}
            onClick={() => setSelectedGame(game)}
            onDeleteGame={() => deleteGame(game._id)}
            onRateGame={updateGameRating}
          />
        ))}
      </div>

      {selectedGame && (
        <Modal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onSave={(updatedGame) => {
            editGame(selectedGame._id, updatedGame);
            setSelectedGame(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;