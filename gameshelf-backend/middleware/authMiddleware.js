const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('role');
    if (!user) return res.status(401).send('User not found');
    
    req.user = {
      _id: decoded.id,
      role: user.role
    };
    
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(400).send('Invalid token');
  }
}

module.exports = auth;