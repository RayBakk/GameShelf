require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Game = require('./models/game');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

// Updated games endpoint with status implementation
app.get('/games', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('games');
    
    // Get games with status (updated implementation)
    const games = await Game.find({ user: decoded.id });
    
    res.json(games.map(game => ({
      _id: game._id,
      title: game.title,
      platform: game.platform,
      status: game.status, // Now using status instead of completed
      rating: game.rating
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Health check endpoint
app.get('/checkdb', async (req, res) => {
  try {
    // Test User collection
    const userCount = await User.countDocuments();
    
    // Test Game collection (only if model exists)
    let gameCount;
    try {
      gameCount = await Game.countDocuments();
    } catch (gameErr) {
      gameCount = 'Game model not available';
    }

    res.json({ 
      status: '✅ MongoDB Active', 
      collections: {
        users: userCount,
        games: gameCount
      }
    });
  } catch (err) {
    res.status(500).json({ 
      error: '❌ MongoDB Connection Failed', 
      details: err.message 
    });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));