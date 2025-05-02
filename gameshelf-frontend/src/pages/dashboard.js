import React, { useEffect, useState } from 'react';
import '../App.css';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/games', {headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setGames(data))
    .catch(err => console.error('Fout bij ophalen games:', err));
}, []);

const totalGames = games.length;
const completedGames = games.filter((game) => game.completed).length;
const completionRate = totalGames > 0 ? ((completedGames / totalGames) * 100).toFixed(2) : 0;

const gamesByPlatform = games.reduce((acc, game) => {
  acc[game.platform] = (acc[game.platform] || 0) + 1;
  return acc;
}, {});

const recentGames = games.slice(-3).reverse();

return (
  <div className="dashboard">
    <h1>Dashboard</h1>

    {/* Game Statistics */}
    <div className="stats">
      <h2>Game Statistics</h2>
      <p>Total Games: <span className="highlight">{totalGames}</span></p>
      <p>Completed Games: <span className="highlight">{completedGames}</span></p>
      <p>Completion Rate: <span className="highlight">{completionRate}%</span></p>
    </div>

    {/* Games by Platform */}
    <div className="platforms">
      <h2>Games by Platform</h2>
      <ul>
        {Object.entries(gamesByPlatform).map(([platform, count]) => (
          <li key={platform}>
            <span className="platform-name">{platform}</span>: <span className="highlight">{count} games</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Recent Activity */}
    <div className="recent-activity">
      <h2>Recent Activity</h2>
      <ul>
        {recentGames.map((game) => (
          <li key={game._id}>
            Added <span className="highlight">"{game.title}"</span> ({game.platform}) - <span className="status">{game.completed ? 'Completed' : 'Not completed'}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default Dashboard;