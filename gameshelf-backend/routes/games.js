const express = require('express');
const axios = require('axios');
const Game = require('../models/Game');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('API is working! 🎮');
});

module.exports = router;
