import React, { useEffect, useState } from 'react';
import '../App.css';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; 
      return;
    }
  
    fetch('http://localhost:5001/games', { 
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch games');
        return res.json();
      })
      .then(data => setGames(data))
      .catch(err => {
        console.error('Error fetching games:', err);
        if (err.message.includes('401')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      });
  }, []);

const totalGames = games.length;
const completedGames = games.filter((game) => game.status === 'Completed').length;
const completionRate = totalGames > 0 ? ((completedGames / totalGames) * 100).toFixed(2) : 0;

const gamesByPlatform = games.reduce((acc, game) => {
  acc[game.platform] = (acc[game.platform] || 0) + 1;
  return acc;
}, {});

const recentGames = games.slice(-3).reverse();



return (
  <div className="dashboard">
    <h1>Dashboard</h1>
    <h2>{user?.username}</h2>

    
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
            Added <span className="highlight">"{game.title}"</span> ({game.platform}) - <span className="status">{game.status}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default Dashboard;