import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import './App.css';
import logo from '../src/images/logo.png';
import PrivateRoute from './components/privateroute';
import Login from './components/login';
import Register from './pages/register';
import Community from './pages/community';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      if (!token) navigate('/login');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="container">
      {/* Conditionally render sidebar */}
      {isLoggedIn && (
        <div className="sidebar">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-home" />
          </Link>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/community">Community</Link></li>
          </ul>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}

      <div className={`main-content ${isLoggedIn ? '' : 'full-width'}`}>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
};

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;