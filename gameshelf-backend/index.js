const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const gamesRoutes = require('./routes/games');

dotenv.config(); // Load .env variables

const app = express(); // 👈 THIS defines app
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/games', gamesRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection failed:', err);
});