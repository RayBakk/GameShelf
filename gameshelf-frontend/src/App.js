import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import './App.css';
import logo from '../src/images/logo.png'
import PrivateRoute from './components/privateroute';
import Login from './components/login';

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

function App() {
  return (
    <Router>
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;