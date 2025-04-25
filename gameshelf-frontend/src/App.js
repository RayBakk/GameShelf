import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import './App.css';

function App() {
  const [games, setGames] = useState(() => {
    const savedGames = localStorage.getItem('games');
    console.log('Loaded games from localStorage:', savedGames);
    return savedGames ? JSON.parse(savedGames) : [];
  });

  useEffect(() => {
    console.log('Saving games to localStorage:', games);
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  return (
    <Router>
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Gameshelf</h2>
          <ul>
            {/* Home and Dashboard links */}
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Home games={games} setGames={setGames} />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard games={games} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;