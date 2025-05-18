require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Game = require('./models/game');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const communityRoutes = require('./routes/community');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use('/api/community', communityRoutes);

app.get('/games', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('games');
    
    const games = await Game.find({ user: decoded.id });
    
    res.json(games.map(game => ({
      _id: game._id,
      title: game.title,
      platform: game.platform,
      status: game.status,
      rating: game.rating
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

app.get('/checkdb', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));