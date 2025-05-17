const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ongeldige inloggegevens" });
    }

    // Belangrijk: Zorg dat de JWT payload het user._id bevat
    const token = jwt.sign(
      { id: user._id }, // Dit moet het MongoDB _id veld zijn
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Geef het volledige user object terug inclusief _id
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email
    };

    res.status(200).json({ 
      token, 
      user: userData 
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;