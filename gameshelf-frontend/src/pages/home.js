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
  const [newGameStatus, setNewGameStatus] = useState('Planning to Play');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/games', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch games');
        
        const data = await response.json();
        setGames(data);
      } catch (err) {
        console.error('Error loading games:', err);
      }
    };

    fetchGames();
  }, []);

  const addGame = async () => {
    if (!newGameTitle.trim()) {
      alert('Please enter a game name.');
      return;
    }
  
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/games', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newGameTitle,
          platform: newGamePlatform,
          status: newGameStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add game');
      }

      const newGame = await response.json();
      setGames([...games, newGame]);
      
      // Reset form
      setNewGameTitle('');
      setNewGamePlatform('Steam');
      setNewGameStatus('Planning to Play');
      setShowForm(false);
    } catch (err) {
      alert(`Error adding game: ${err.message}`);
      console.error('Add game error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete game');
      }
  
      // Update state only after successful deletion
      setGames(games.filter(game => game._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete game: ${err.message}`);
    }
  };

  const updateGameRating = async (id, rating) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/games/${id}/rating`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update rating');
      }
  
      const updatedGame = await response.json();
      setGames(games.map(game => 
        game._id === id ? updatedGame : game
      ));
    } catch (err) {
      console.error('Rating update error:', err);
      alert('Failed to update rating');
    }
  };

  const updateGameStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/games/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status }) // <-- Must match backend expectation
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend error:', errorData); // Add this for debugging
        throw new Error(errorData.message || 'Failed to update status');
      }
  
      const updatedGame = await response.json();
      setGames(games.map(game => 
        game._id === id ? updatedGame : game
      ));
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
  };

  const filteredAndSortedGames = games
    .filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(game => sortBy === '' || game.status === sortBy);

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
              required
            />
            <select
              value={newGamePlatform}
              onChange={(e) => setNewGamePlatform(e.target.value)}
            >
              <option value="Steam">Steam</option>
              <option value="Epic Games">Epic Games</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
            </select>
            <select
              value={newGameStatus}
              onChange={(e) => setNewGameStatus(e.target.value)}
            >
              <option value="Planning to Play">Planning to Play</option>
              <option value="Playing">Playing</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="modal-buttons">
              <button onClick={addGame} disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Game'}
              </button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <select 
        className="custom-dropdown" 
        onChange={(e) => setSortBy(e.target.value)} 
        value={sortBy}
      >
        <option value="">Sort by status</option>
        <option value="Planning to Play">Planning to Play</option>
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
            onUpdateStatus={updateGameStatus}
          />
        ))}
      </div>

      {selectedGame && (
        <Modal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onSave={(updates) => {
            updateGameStatus(selectedGame._id, updates.status);
            setSelectedGame(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;