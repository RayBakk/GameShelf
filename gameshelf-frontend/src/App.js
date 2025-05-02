import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import './App.css';
import logo from '../src/images/logo.png'

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
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;