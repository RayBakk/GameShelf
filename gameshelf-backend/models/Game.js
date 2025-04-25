const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: String,
  platform: String,
  completed: Boolean,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Game', gameSchema);