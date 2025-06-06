const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  status: {
    type: String,
    enum: ['Planning to Play', 'Playing', 'Completed'],
    default: 'Planning to Play'
  },
  coverImage: {type: String},
  rating: { type: Number, min: 0, max: 5, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.models.Game || mongoose.model('Game', gameSchema);