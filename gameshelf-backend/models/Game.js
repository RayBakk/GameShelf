const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: String,
  platform: String,
  status: { type: String, default: 'Planning to Play' },
  image: String
});

module.exports = mongoose.model('Game', gameSchema);