const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
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

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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