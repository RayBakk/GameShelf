const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.find({ user: req.user });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: 'Fout bij ophalen games', error: err });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, platform, completed } = req.body;

  try {
    const newGame = new Game({
      title,
      platform,
      completed,
      user: req.user
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ message: 'Fout bij toevoegen game', error: err });
  }
});

module.exports = router;
