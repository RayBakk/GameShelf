const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const auth = require('../middleware/authMiddleware');
const axios = require('axios');
require('dotenv').config();

// Get all games for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.find({ user: req.user });
    res.json(games);
  } catch (err) {
    res.status(500).json({ 
      message: 'Fout bij ophalen games', 
      error: err.message 
    });
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
      user: req.user
    });

    await newGame.save();
    res.status(201).json(newGame);

  } catch (err) {
    res.status(400).json({ 
      message: 'Fout bij toevoegen game', 
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

module.exports = router;