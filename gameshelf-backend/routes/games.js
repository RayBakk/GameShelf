const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const auth = require('../middleware/authMiddleware');
const axios = require('axios');
require('dotenv').config();

router.get('/', auth, async (req, res) => {
  try {
    console.log("Fetching games for user:", req.user); 
    const games = await Game.find({ user: req.user._id || req.user });
    console.log("Found games:", games.length);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', auth, async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 3) {
    return res.json([]);
  }

  try {
    const rawgResponse = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=5`
    );

    const suggestions = rawgResponse.data.results.map(game => ({
      id: game.id,
      title: game.name,
      image: game.background_image,
      platforms: game.platforms?.map(p => p.platform.name).join(', ') || 'Unknown'
    }));
    res.json(suggestions);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Failed to search games' });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, platform, status } = req.body;

  try {
    const rawgResponse = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(title)}`
    );

    const coverImage = rawgResponse.data.results[0]?.background_image || null;

    const newGame = new Game({
      title,
      platform,
      status,
      coverImage,
      rating: 0,
      user: req.user._id || req.user
    });

    await newGame.save();
    res.status(201).json(newGame);

  } catch (err) {
    res.status(400).json({ 
      message: 'Error adding game', 
      error: err.message 
    });
  }
});

router.patch('/:id/rating', auth, async (req, res) => {
  try {
    const game = await Game.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { rating: req.body.rating },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (err) {
    res.status(400).json({
      message: 'Error updating rating',
      error: err.message
    });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const game = await Game.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { status: req.body.status },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (err) {
    res.status(400).json({
      message: 'Error updating status',
      error: err.message
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error deleting game',
      error: err.message 
    });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Game.deleteMany({ user: req.user._id || req.user });
    res.json({ message: 'All games deleted successfully' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error deleting games',
      error: err.message 
    });
  }
});

module.exports = router;