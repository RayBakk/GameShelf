import React, { useState, useEffect} from 'react';
import GameCard from '../components/gamecard';
import Modal from '../components/modal';
import API from '../api';

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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const justSelectedSuggestionRef = React.useRef(false);


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await API.get('/games');
        setGames(response.data);
      } catch (err) {
        console.error('Error loading games:', err.response?.data);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setSelectedGame(null);
        setShowSuggestions(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const searchGames = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await API.get(`/games/search?query=${encodeURIComponent(query)}`);
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Search error:', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
  const timer = setTimeout(() => {

    if (justSelectedSuggestionRef.current) return;

    if (newGameTitle && newGameTitle.length >= 3) {
      searchGames(newGameTitle);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [newGameTitle]);




  const handleGameTitleChange = (e) => {
    setNewGameTitle(e.target.value);
  };

  const selectSuggestion = (suggestion) => {
  justSelectedSuggestionRef.current = true;
  setNewGameTitle(suggestion.title);
  setShowSuggestions(false);
  setSuggestions([]);

  setTimeout(() => {
    justSelectedSuggestionRef.current = false;
  }, 500);
};



  const addGame = async () => {
    if (!newGameTitle.trim()) {
      alert('Please enter a game name.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post('/games', {
        title: newGameTitle,
        platform: newGamePlatform,
        status: newGameStatus
      });

      setGames([...games, response.data]);
      setNewGameTitle('');
      setNewGamePlatform('Steam');
      setNewGameStatus('Planning to Play');
      setShowForm(false);
      setShowSuggestions(false);
      setSuggestions([]);
    } catch (err) {
      alert(`Error adding game: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      await API.delete(`/games/${id}`);
      setGames(games.filter(game => game._id !== id));
    } catch (err) {
      alert(`Failed to delete game: ${err.response?.data?.message || err.message}`);
    }
  };

  const updateGameRating = async (id, rating) => {
    try {
      const response = await API.patch(`/games/${id}/rating`, 
        { rating }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setGames(games.map(game => 
        game._id === id ? response.data : game
      ));
    } catch (err) {
      console.error('Error:', err.response?.data);
    }
  };

  const updateGameStatus = async (id, status) => {
    try {
      const response = await API.patch(`/games/${id}/status`, 
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setGames(games.map(game => 
        game._id === id ? response.data : game
      ));
    } catch (err) {
      console.error('Error:', err.response?.data);
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

      <button className='addgame-button' onClick={() => setShowForm(true)}>Add Game</button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Game</h3>
            <div className="game-search-container">
              <input
                type="text"
                placeholder="Game Name"
                value={newGameTitle}
                onChange={handleGameTitleChange}
                required
              />
              {isSearching && <div className="search-loading">Searching...</div>}
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="suggestion-item"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion.image && (
                        <img 
                          src={suggestion.image} 
                          alt={suggestion.title}
                          className="suggestion-image"
                        />
                      )}
                      <div className="suggestion-info">
                        <div className="suggestion-title">{suggestion.title}</div>
                        <div className="suggestion-platforms">{suggestion.platforms}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              <button onClick={() => {
                setShowForm(false);
                setShowSuggestions(false);
                setSuggestions([]);
                setNewGameTitle('');
              }}>Cancel</button>
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