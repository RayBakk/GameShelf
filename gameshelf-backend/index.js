const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const gamesRoutes = require('./routes/games');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../gameshelf-frontend/build')));

app.use('/api/games', gamesRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../gameshelf-frontend/build/index.html'));
});

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });

  const authRoutes = require('./routes/Auth');
app.use('/api/auth', authRoutes);
