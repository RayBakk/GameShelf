const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const gamesRoutes = require('./routes/games');

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/games', gamesRoutes);

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection failed:', err);
});